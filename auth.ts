import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Google from "next-auth/providers/google";
import { createOrUpdateUser, getUserRole } from "@/lib/supabase";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/protected", "/my-votes", "/admin"];
      const isOnProtectedPage = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      if (isOnProtectedPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user && token.email) {
        // Add user ID to the session using email as ID
        session.user.id = token.email as string;

        // Create or update user in database
        await createOrUpdateUser({
          id: session.user.id,
          email: token.email as string,
          name: session.user.name,
          image_url: session.user.image,
        });

        // Get user role and add to session
        const role = await getUserRole(session.user.id);
        session.user.role = role || "user";

        console.log("session with role", session);
      }
      return session;
    },
    jwt({ token }) {
      return token;
    },
  },
});

// Middleware to protect routes
export async function middleware(request: NextRequest) {
  const session = await auth();

  // Define admin-only paths
  const adminPaths = ["/admin"];
  const protectedPaths = ["/protected", "/my-votes"];

  // Check if the current path requires admin privileges
  const isAdminPath = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to signin if trying to access any protected route without auth
  if (!session?.user?.id && (isAdminPath || isProtectedPath)) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signinUrl);
  }

  // Check admin privileges for admin routes
  if (isAdminPath && session?.user?.id) {
    if (session.user.role !== "admin") {
      // Redirect non-admin users to home page with error
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "insufficient_permissions");
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}
