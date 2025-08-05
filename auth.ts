import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Google from "next-auth/providers/google";

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
    session({ session, token }) {
      if (session?.user) {
        // Add user ID to the session using email as ID (since we're using Google Auth)
        session.user.id = (token.email || token.sub || "") as string;
        console.log("session", session);
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

  // Define protected paths
  const protectedPaths = ["/admin"];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to signin if trying to access protected route without auth
  if (!session?.user?.id && isProtectedPath) {
    const signinUrl = new URL("/signin", request.url);
    // Add a redirect parameter to return after login
    signinUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}
