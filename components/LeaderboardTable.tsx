import Image from "next/image";

interface YouTuber {
  id: string;
  name: string;
  image_url: string;
  channel_url: string;
  vote_count: number;
}

export function LeaderboardTable({ youtubers }: { youtubers: YouTuber[] }) {
  return (
    <section className="py-8 bg-primary/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {youtubers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      YouTuber
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {youtubers.map((youtuber, index) => (
                    <tr
                      key={youtuber.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                              sizes="40px"
                              loading="lazy"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {youtuber.name}
                            </div>
                            <a
                              href={youtuber.channel_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary/90"
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
              <p className="text-muted-foreground">
                No YouTubers have been added to the competition yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
