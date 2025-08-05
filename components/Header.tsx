import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="bg-white py-4 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              V
            </div>
            <span className="text-lg font-medium tracking-tight">
              YoutubeChamp
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:block">
              <ul className="flex gap-8">
                <li>
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-primary font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-gray-500 hover:text-primary"
                  >
                    Leaderboard
                  </Link>
                </li>
                {session?.user && (
                  <li>
                    <Link
                      href="/my-votes"
                      className="text-gray-500 hover:text-primary"
                    >
                      My Votes
                    </Link>
                  </li>
                )}
                {session?.user?.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
