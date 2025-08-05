import Image from "next/image";

interface YouTuber {
  id: string;
  name: string;
  image_url: string;
  channel_url: string;
  vote_count: number;
}

export function LeaderboardTopThree({ topThree }: { topThree: YouTuber[] }) {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8">
          {/* 2nd Place */}
          {topThree.length > 1 && (
            <div className="w-full md:w-1/4 flex flex-col items-center order-2 md:order-1">
              <div className="relative w-28 h-28 mb-4">
                <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-10">
                  2
                </div>
                <Image
                  src={
                    topThree[1].image_url || "https://via.placeholder.com/150"
                  }
                  alt={topThree[1].name}
                  fill
                  sizes="(max-width: 768px) 112px, 112px"
                  priority={true}
                  className="object-cover rounded-full border-4 border-secondary"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold truncate max-w-[180px]">
                  {topThree[1].name}
                </h3>
                <p className="text-2xl font-medium text-secondary mt-1">
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
                    topThree[0].image_url || "https://via.placeholder.com/200"
                  }
                  alt={topThree[0].name}
                  fill
                  sizes="(max-width: 768px) 144px, 144px"
                  priority={true}
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
                    topThree[2].image_url || "https://via.placeholder.com/120"
                  }
                  alt={topThree[2].name}
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
                  priority={true}
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
  );
}
