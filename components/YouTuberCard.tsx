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
    <Card className="group relative overflow-hidden transition-all duration-300 ease-out h-full hover:shadow-soft hover:-translate-y-1 bg-gradient-to-b from-white to-gray-50/50">
      {/* Premium badge for top voted */}
      {youtuber.vote_count > 50 && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
          🏆 Popular
        </div>
      )}

      {/* Image container with overlay effects */}
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <Image
          src={
            youtuber.image_url ||
            "https://via.placeholder.com/640x360/f3f4f6/9ca3af?text=No+Image"
          }
          alt={youtuber.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Vote status overlay */}
        {hasVoted && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <span className="text-[10px]">✓</span>
            Voted
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <CardHeader className="pb-3 pt-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight tracking-tight text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
              {youtuber.name}
            </h3>
            <a
              href={youtuber.channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
              View Channel
            </a>
          </div>
        </CardHeader>

        {youtuber.description && (
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {youtuber.description}
            </p>
          </CardContent>
        )}

        <div className="mt-auto">
          <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Vote count with enhanced styling */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-gray-700">
                <div className="p-1.5 bg-primary-50 rounded-lg">
                  <svg
                    className="w-4 h-4 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V8a2 2 0 012-2h2.343M7 20L4.343 18.657A2 2 0 014 17.172V10.828a2 2 0 01.343-1.485L6.586 7.172a2 2 0 011.414-.586h2"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-gray-900">
                  {youtuber.vote_count}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {youtuber.vote_count === 1 ? "vote" : "votes"}
                </span>
              </div>
            </div>

            {/* Enhanced vote button */}
            <Button
              onClick={handleVote}
              disabled={
                hasVoted || voting || (!hasVoted && hasReachedVoteLimit)
              }
              size="sm"
              variant={getButtonVariant()}
              className={`
                min-w-[100px] font-medium transition-all duration-200 shadow-sm
                ${
                  hasVoted
                    ? "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                    : hasReachedVoteLimit
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                }
                ${voting ? "cursor-not-allowed" : ""}
              `}
            >
              {getButtonContent()}
            </Button>
          </CardFooter>

          {/* Enhanced error message */}
          {error && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg
                  className="w-4 h-4 text-red-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
