import { auth } from "@/auth";
import { getYouTubers, getUserVotes } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { redirect } from "next/navigation";

export default async function MyVotes() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  // Get all YouTubers and user votes
  const allYoutubers = await getYouTubers();
  const userVotedIds = await getUserVotes(session.user.id);

  // Filter to only show YouTubers the user has voted for
  const votedYoutubers = allYoutubers.filter((youtuber) =>
    userVotedIds.includes(youtuber.id)
  );

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
                      className="text-gray-500 hover:text-primary-500"
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
                  <li>
                    <Link
                      href="/my-votes"
                      className="text-gray-800 hover:text-primary-500 font-medium"
                    >
                      My Votes
                    </Link>
                  </li>
                </ul>
              </nav>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-12 bg-background-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              My Votes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Content creators you've supported
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {votedYoutubers.length === 0 ? (
              <div className="rounded-2xl bg-background-dark p-10 flex flex-col items-center justify-center text-center">
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
                    className="text-gray-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4"></path>
                    <path d="M12 16h.01"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4">No Votes Yet</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  You haven't voted for any YouTubers yet. Visit the home page
                  to cast your votes!
                </p>
                <Link
                  href="/"
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-full py-2.5 px-6 font-medium transition-colors"
                >
                  Vote Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {votedYoutubers.map((youtuber) => (
                  <div
                    key={youtuber.id}
                    className="card bg-white overflow-hidden rounded-lg transition-all"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={
                          youtuber.image_url ||
                          "https://via.placeholder.com/640x360?text=No+Image"
                        }
                        alt={youtuber.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-1">
                        {youtuber.name}
                      </h3>
                      <a
                        href={youtuber.channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 text-sm inline-block"
                      >
                        View Channel
                      </a>

                      {youtuber.description && (
                        <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">
                          {youtuber.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400 mr-1"
                          >
                            <path d="M7 10v12"></path>
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                          </svg>
                          <span className="text-gray-700 font-medium">
                            {youtuber.vote_count}
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-100">
                          Voted
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white mt-10 py-8 border-t border-gray-100">
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
