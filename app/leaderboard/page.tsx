import { getYouTubers } from "@/lib/supabase";
import { Footer } from "@/components/Footer";
import { LeaderboardTopThree } from "@/components/LeaderboardTopThree";
import { LeaderboardTable } from "@/components/LeaderboardTable";

export const metadata = {
  title: "Leaderboard - VoteYT",
  description: "See who's leading the competition right now on VoteYT",
};

export default async function Leaderboard() {
  const youtubers = await getYouTubers();

  // Sort by vote count to ensure top youtubers are first
  const sortedYoutubers = [...youtubers].sort(
    (a, b) => b.vote_count - a.vote_count
  );

  // Find the top three for special styling
  const topThree = sortedYoutubers.slice(0, 3);
  const rest = sortedYoutubers.slice(3);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 bg-primary/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See who&apos;s leading the competition right now
            </p>
          </div>
        </section>

        {topThree.length > 0 && <LeaderboardTopThree topThree={topThree} />}

        {/* Rest of the YouTubers */}
        <LeaderboardTable youtubers={rest} />
      </main>

      <Footer />
    </div>
  );
}
