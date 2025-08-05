import { auth } from "@/auth";
import { getAllVotesWithDetails, isUserAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const metadata = {
  title: "All Votes - Admin Panel",
  description: "View all votes with detailed information using joined tables",
};

export default async function AdminVotes() {
  const session = await auth();

  // Redirect if not authenticated or not admin
  if (!session?.user) {
    redirect("/signin");
  }

  const userIsAdmin = await isUserAdmin(session.user.id as string);
  if (!userIsAdmin) {
    redirect("/");
  }

  // Get all votes with full details (joined data)
  const allVotesWithDetails = await getAllVotesWithDetails();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 bg-primary/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              All Votes Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete vote details with joined user and YouTuber data
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {allVotesWithDetails.length === 0 ? (
              <div className="rounded-2xl bg-primary/5 p-10 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-semibold mb-4">No Votes Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  No votes have been cast yet.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    Total Votes: {allVotesWithDetails.length}
                  </p>
                  <p className="text-muted-foreground">
                    Showing detailed vote information with joined data
                  </p>
                </div>

                <div className="grid gap-6">
                  {allVotesWithDetails.map((vote) => (
                    <Card key={vote.id} className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        {/* Vote Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            Vote Details
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Vote ID:</span>{" "}
                              {vote.id}
                            </p>
                            <p>
                              <span className="font-medium">Cast on:</span>{" "}
                              {new Date(vote.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">Voter</h3>
                          <div className="flex items-center gap-3">
                            {vote.user.image_url && (
                              <Image
                                src={vote.user.image_url}
                                alt={vote.user.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {vote.user.name || "Anonymous"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {vote.user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* YouTuber Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">Voted For</h3>
                          <div className="flex items-center gap-3">
                            {vote.youtuber.image_url && (
                              <Image
                                src={vote.youtuber.image_url}
                                alt={vote.youtuber.name}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {vote.youtuber.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total votes: {vote.youtuber.vote_count}
                              </p>
                              <a
                                href={vote.youtuber.channel_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Channel
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary Stats */}
                <Card className="p-6 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Vote Statistics (from joined data)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {allVotesWithDetails.length}
                        </p>
                        <p className="text-muted-foreground">Total Votes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {
                            new Set(allVotesWithDetails.map((v) => v.user_id))
                              .size
                          }
                        </p>
                        <p className="text-muted-foreground">Unique Voters</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {
                            new Set(
                              allVotesWithDetails.map((v) => v.youtuber_id)
                            ).size
                          }
                        </p>
                        <p className="text-muted-foreground">
                          YouTubers with Votes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
