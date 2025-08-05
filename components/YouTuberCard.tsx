"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { voteForYouTuber } from "@/lib/supabase";
import type { YouTuber } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface YouTuberCardProps {
  youtuber: YouTuber;
  hasVoted: boolean;
  hasReachedVoteLimit: boolean;
  onVote: (id: string) => void;
}

export default function YouTuberCard({
  youtuber,
  hasVoted,
  hasReachedVoteLimit,
  onVote,
}: YouTuberCardProps) {
  const { data: session } = useSession();
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVote = async () => {
    if (!session?.user?.id) {
      router.push("/signin");
      return;
    }

    if (hasVoted) {
      setError("You have already voted for this YouTuber");
      return;
    }

    setVoting(true);
    setError("");

    try {
      const result = await voteForYouTuber(session.user.id, youtuber.id);
      if (result.success) {
        onVote(youtuber.id);
      } else {
        setError(result.error || "Failed to vote. Please try again.");
      }
    } catch (err) {
      setError("Failed to vote. Please try again.");
      console.log(err);
    } finally {
      setVoting(false);
    }
  };

  const getButtonContent = () => {
    if (voting) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Voting...</span>
        </div>
      );
    }
    if (hasVoted) return "✓ Voted";
    if (hasReachedVoteLimit) return "Vote Limit Reached";
    return "Vote";
  };

  const getButtonVariant = () => {
    if (hasVoted) return "outline";
    if (hasReachedVoteLimit) return "secondary";
    return "default";
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 ease-out h-full hover:shadow-soft p-0 hover:-translate-y-1 bg-gradient-to-b from-white via-white to-gray-50/30">
      {/* Premium badge for top voted */}
      {youtuber.vote_count > 50 && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
          🏆 Popular
        </div>
      )}

      {/* Enhanced Image container with better styling */}
      <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Loading skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        <Image
          src={
            youtuber.image_url ||
            "https://via.placeholder.com/640x400/f8fafc/64748b?text=No+Image+Available"
          }
          alt={youtuber.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.opacity = "1";
          }}
          style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
        />

        {/* Enhanced gradient overlay with better visual hierarchy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500" />

        {/* Subtle inner border for premium feel */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />

        {/* Vote status overlay with enhanced styling */}
        {hasVoted && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-primary-200/50 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span>Voted</span>
          </div>
        )}

        {/* Subtle corner accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-primary-500/10 to-transparent" />
      </div>

      <div className="flex flex-col flex-grow">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900 group-hover:text-primary-700 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
              {youtuber.name}
            </h3>
            <a
              href={youtuber.channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-all duration-200 hover:gap-3 group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/link:rotate-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative">
                View Channel
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover/link:w-full" />
              </span>
            </a>
          </div>
        </CardHeader>

        {youtuber.description && (
          <CardContent className="pt-0 pb-6 px-6">
            <div className="relative">
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed tracking-wide">
                {youtuber.description}
              </p>
              {/* Subtle fade effect for long descriptions */}
              <div className="absolute bottom-0 right-0 w-8 h-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </CardContent>
        )}

        <div className="mt-auto">
          <CardFooter className="flex items-center justify-between pt-6 px-6 border-t border-gray-100/80">
            {/* Enhanced vote count with better visual hierarchy */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative p-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V8a2 2 0 012-2h2.343M7 20L4.343 18.657A2 2 0 014 17.172V10.828a2 2 0 01.343-1.485L6.586 7.172a2 2 0 011.414-.586h2"
                    />
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-primary-400/20 rounded-xl blur-md -z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 leading-tight">
                    {youtuber.vote_count}
                  </span>
                  <span className="text-xs text-gray-500 font-medium leading-tight -mt-1">
                    {youtuber.vote_count === 1 ? "vote" : "votes"}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium enhanced vote button */}
            <Button
              onClick={handleVote}
              disabled={
                hasVoted || voting || (!hasVoted && hasReachedVoteLimit)
              }
              size="lg"
              variant={getButtonVariant()}
              className={`
                min-w-[120px] px-6 py-3 font-semibold transition-all duration-300 transform
                ${
                  hasVoted
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-2 border-primary-200 hover:from-primary-100 hover:to-primary-150 shadow-md"
                    : hasReachedVoteLimit
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                    : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl active:scale-95 border-2 border-primary-600 hover:border-primary-700"
                }
                ${voting ? "cursor-not-allowed" : ""}
                rounded-xl relative overflow-hidden
              `}
            >
              {/* Button glow effect */}
              {!hasVoted && !hasReachedVoteLimit && !voting && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/30 to-primary-500/30 blur-xl -z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              )}
              {getButtonContent()}
            </Button>
          </CardFooter>

          {/* Premium enhanced error message */}
          {error && (
            <div className="px-6 pb-6">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200/70 rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex-shrink-0 p-1 bg-red-100 rounded-lg">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-800 text-sm font-semibold leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
