import { auth } from "@/auth";
import { getYouTubers } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

export default async function Leaderboard() {
  const session = await auth();
  const youtubers = await getYouTubers();

  // Sort by vote count to ensure top youtubers are first
  const sortedYoutubers = [...youtubers].sort(
    (a, b) => b.vote_count - a.vote_count
  );

  // Find the top three for special styling
  const topThree = sortedYoutubers.slice(0, 3);
  const rest = sortedYoutubers.slice(3);

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
                      className="text-gray-800 hover:text-primary-500 font-medium"
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
        <section className="py-12 bg-background-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Leaderboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See who&apos;s leading the competition right now
            </p>
          </div>
        </section>

        {topThree.length > 0 && (
          <section className="py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8">
                {/* 2nd Place */}
                {topThree.length > 1 && (
                  <div className="w-full md:w-1/4 flex flex-col items-center order-2 md:order-1">
                    <div className="relative w-28 h-28 mb-4">
                      <div className="absolute top-0 right-0 bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-10">
                        2
                      </div>
                      <Image
                        src={
                          topThree[1].image_url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={topThree[1].name}
                        fill
                        className="object-cover rounded-full border-4 border-gray-200"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold truncate max-w-[180px]">
                        {topThree[1].name}
                      </h3>
                      <p className="text-2xl font-medium text-gray-700 mt-1">
                        <span className="font-semibold">
                          {topThree[1].vote_count}
                        </span>{" "}
                        votes
                      </p>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree.length > 0 && (
                  <div className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2 mb-6 md:mb-0">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <div className="relative w-36 h-36 mb-4">
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10">
                        1
                      </div>
                      <Image
                        src={
                          topThree[0].image_url ||
                          "https://via.placeholder.com/200"
                        }
                        alt={topThree[0].name}
                        fill
                        className="object-cover rounded-full border-4 border-yellow-400"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold truncate max-w-[200px]">
                        {topThree[0].name}
                      </h3>
                      <p className="text-3xl font-medium text-yellow-500 mt-1">
                        <span className="font-semibold">
                          {topThree[0].vote_count}
                        </span>{" "}
                        votes
                      </p>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree.length > 2 && (
                  <div className="w-full md:w-1/4 flex flex-col items-center order-3">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute top-0 right-0 bg-amber-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold z-10">
                        3
                      </div>
                      <Image
                        src={
                          topThree[2].image_url ||
                          "https://via.placeholder.com/120"
                        }
                        alt={topThree[2].name}
                        fill
                        className="object-cover rounded-full border-4 border-amber-700"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold truncate max-w-[160px]">
                        {topThree[2].name}
                      </h3>
                      <p className="text-xl font-medium text-amber-700 mt-1">
                        <span className="font-semibold">
                          {topThree[2].vote_count}
                        </span>{" "}
                        votes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Rest of the YouTubers */}
        <section className="py-8 bg-background-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              {rest.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rank
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          YouTuber
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Votes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {rest.map((youtuber, index) => (
                        <tr
                          key={youtuber.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 4}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 relative flex-shrink-0">
                                <Image
                                  className="rounded-full object-cover"
                                  src={
                                    youtuber.image_url ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={youtuber.name}
                                  fill
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {youtuber.name}
                                </div>
                                <a
                                  href={youtuber.channel_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary-500 hover:text-primary-600"
                                >
                                  View Channel
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-semibold">
                              {youtuber.vote_count}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No YouTubers have been added to the competition yet.
                  </p>
                </div>
              )}
            </div>
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
