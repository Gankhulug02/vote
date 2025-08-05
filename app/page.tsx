import { auth } from "@/auth";
import { getYouTubers, getUserVotes } from "@/lib/supabase";
import { AuthButton } from "@/components/AuthButton";
import YouTuberList from "@/components/YouTuberList";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const session = await auth();

  // Fetch data in parallel for better performance
  const [youtubers, userVotedYoutubers] = await Promise.all([
    getYouTubers(),
    session?.user?.id ? getUserVotes(session.user.id) : [],
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 bg-primary/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Vote for Your Favorite YouTubers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              <div className="rounded-2xl bg-primary/5 p-8 flex flex-col items-center justify-center text-center">
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
                    className="text-primary"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Sign In to Vote</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Join the community and cast your vote for your favorite
                  content creators.
                </p>
                <AuthButton />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
