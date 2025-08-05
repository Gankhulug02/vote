"use client";

import { useState } from "react";
import YouTuberCard from "./YouTuberCard";
import type { YouTuber } from "@/lib/supabase";

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

  // Handle successful vote
  const handleVote = (youtuberId: string) => {
    setVotedIds((prev) => [...prev, youtuberId]);

    // Update local vote count for immediate UI update
    setYoutubers((prev) =>
      prev.map((youtuber) =>
        youtuber.id === youtuberId
          ? { ...youtuber, vote_count: youtuber.vote_count + 1 }
          : youtuber
      )
    );
  };

  // Filter by search query
  const filteredYoutubers = youtubers.filter((youtuber) =>
    youtuber.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
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
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="text"
            placeholder="Search YouTubers..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-primary-100 rounded-lg shadow-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredYoutubers.length === 0 ? (
        <div className="text-center py-12 bg-primary-50 rounded-lg">
          <p className="text-primary-700">
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
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
