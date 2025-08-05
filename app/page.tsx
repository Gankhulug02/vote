import { auth } from "@/auth";
import { getYouTubers, getUserVotes } from "@/lib/supabase";
import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";
import YouTuberList from "@/components/YouTuberList";

export default async function Home() {
  const session = await auth();
  const youtubers = await getYouTubers();

  // Get user votes if logged in
  const userVotedYoutubers = session?.user?.id
    ? await getUserVotes(session.user.id)
    : [];

  return (
    <div className="font-sans min-h-screen bg-white">
      <header className="bg-white py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                V
              </div>
              <span className="text-lg font-medium tracking-tight">VoteYT</span>
            </Link>

            <div className="flex items-center gap-8">
              <nav className="hidden md:block">
                <ul className="flex gap-8">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-800 hover:text-primary-500 font-medium"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/leaderboard"
                      className="text-gray-500 hover:text-primary-500"
                    >
                      Leaderboard
                    </Link>
                  </li>
                  {session?.user && (
                    <li>
                      <Link
                        href="/my-votes"
                        className="text-gray-500 hover:text-primary-500"
                      >
                        My Votes
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

      <main>
        <section className="py-12 bg-primary-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Vote for Your Favorite YouTubers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support the content creators you love. One vote, one voice.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {session?.user ? (
              <YouTuberList
                youtubers={youtubers}
                userVotedYoutubers={userVotedYoutubers}
              />
            ) : (
              <div className="rounded-2xl bg-primary-100 p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-4 rounded-full mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Sign In to Vote</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Join the community and cast your vote for your favorite
                  content creators.
                </p>
                <AuthButton />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white mt-10 py-8 border-t border-primary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold mr-2">
              V
            </div>
            <span className="text-lg font-medium">VoteYT</span>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} VoteYT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
