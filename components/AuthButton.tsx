"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <button
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] flex items-center justify-center font-medium text-sm h-10 px-4 opacity-50"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-sm">
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
    >
      Sign in with Google
    </button>
  );
}
