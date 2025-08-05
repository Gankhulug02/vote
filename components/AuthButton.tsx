"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <div className="animate-pulse h-5 w-24 bg-primary-100 rounded"></div>
      </Button>
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium line-clamp-1 max-w-[120px]">
              {session.user?.name?.split(" ")[0] ||
                session.user?.email?.split("@")[0]}
            </span>
            {session.user?.role === "admin" && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <Button
            onClick={() => signOut()}
            variant="link"
            className="h-auto p-0 text-xs"
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("google")} className="rounded-full">
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
      >
        <path d="M15 3h6v6"></path>
        <path d="M10 14 21 3"></path>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      </svg>
      Sign in
    </Button>
  );
}
