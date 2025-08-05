"use client";

import { useState, useCallback } from "react";
import YouTuberCard from "./YouTuberCard";
import type { YouTuber } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface YouTuberListProps {
  youtubers: YouTuber[];
  userVotedYoutubers: string[];
}

export default function YouTuberList({
  youtubers: initialYoutubers,
  userVotedYoutubers,
}: YouTuberListProps) {
  const [youtubers, setYoutubers] = useState(initialYoutubers);
  const [votedIds, setVotedIds] = useState<string[]>(userVotedYoutubers);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Handle successful vote
  const handleVote = useCallback((youtuberId: string) => {
    setVotedIds((prev) => [...prev, youtuberId]);

    // Update local vote count for immediate UI update
    setYoutubers((prev) =>
      prev.map((youtuber) =>
        youtuber.id === youtuberId
          ? { ...youtuber, vote_count: youtuber.vote_count + 1 }
          : youtuber
      )
    );
  }, []);

  // Calculate remaining votes
  const maxVotes = 3;
  const usedVotes = votedIds.length;
  const remainingVotes = maxVotes - usedVotes;

  // Filter by search query
  const filteredYoutubers = youtubers.filter((youtuber) =>
    youtuber.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div>
      {/* Vote Counter */}
      <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              className="text-primary"
            >
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            <span className="font-medium">Your Votes</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {usedVotes} / {maxVotes}
            </div>
            <div className="text-sm text-muted-foreground">
              {remainingVotes > 0
                ? `${remainingVotes} remaining`
                : "No votes remaining"}
            </div>
          </div>
        </div>
        {remainingVotes === 0 && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            You have used all your votes. You can vote for a maximum of 3
            YouTubers.
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <Input
            type="text"
            placeholder="Search YouTubers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search YouTubers"
          />
        </div>
      </div>

      {filteredYoutubers.length === 0 ? (
        <div className="text-center py-12 bg-primary/5 rounded-lg">
          <p className="text-muted-foreground">
            No YouTubers found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredYoutubers.map((youtuber) => (
            <YouTuberCard
              key={youtuber.id}
              youtuber={youtuber}
              hasVoted={votedIds.includes(youtuber.id)}
              hasReachedVoteLimit={remainingVotes === 0}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
