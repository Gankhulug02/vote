import { auth } from "@/auth";
import { getYouTubers, getUserVotes } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { VotedYouTuberCard } from "@/components/VotedYouTuberCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Votes - YoutubeChamp",
  description: "See content creators you've supported on YoutubeChamp",
};

export default async function MyVotes() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  // Get all YouTubers and user votes in parallel
  const [allYoutubers, userVotedIds] = await Promise.all([
    getYouTubers(),
    getUserVotes(session.user.id as string),
  ]);

  // Filter to only show YouTubers the user has voted for
  const votedYoutubers = allYoutubers.filter((youtuber) =>
    userVotedIds.includes(youtuber.id)
  );

  console.log("votedYoutubers", votedYoutubers);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 bg-primary/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              My Votes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Content creators you&apos;ve supported
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {votedYoutubers.length === 0 ? (
              <div className="rounded-2xl bg-primary/5 p-10 flex flex-col items-center justify-center text-center">
                <div className="bg-background p-4 rounded-full mb-6 shadow-sm">
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
                    className="text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4"></path>
                    <path d="M12 16h.01"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4">No Votes Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  You haven&apos;t voted for any YouTubers yet. Visit the home
                  page to cast your votes!
                </p>
                <Button asChild>
                  <Link href="/">Vote Now</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {votedYoutubers.map((youtuber) => (
                  <VotedYouTuberCard key={youtuber.id} youtuber={youtuber} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
