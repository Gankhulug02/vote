"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <button
        className="bg-primary-50 rounded-full py-2 px-4 flex items-center justify-center text-sm font-medium opacity-70"
        disabled
      >
        <div className="animate-pulse h-5 w-24 bg-primary-100 rounded"></div>
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex gap-3 items-center">
        {session.user?.image && (
          <div className="relative h-8 w-8">
            <Image
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              className="rounded-full"
              fill
              sizes="32px"
            />
          </div>
        )}
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium line-clamp-1 max-w-[150px]">
            {session.user?.name?.split(" ")[0] ||
              session.user?.email?.split("@")[0]}
          </span>
          <button
            onClick={() => signOut()}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-primary-500 hover:bg-primary-600 text-white rounded-full py-2 px-5 flex items-center justify-center text-sm font-medium transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M15 3h6v6"></path>
        <path d="M10 14 21 3"></path>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      </svg>
      Sign in
    </button>
  );
}
