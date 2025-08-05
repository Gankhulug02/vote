"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { voteForYouTuber } from "@/lib/supabase";
import type { YouTuber } from "@/lib/supabase";

interface YouTuberCardProps {
  youtuber: YouTuber;
  hasVoted: boolean;
  onVote: (id: string) => void;
}

export default function YouTuberCard({
  youtuber,
  hasVoted,
  onVote,
}: YouTuberCardProps) {
  const { data: session } = useSession();
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const handleVote = async () => {
    if (!session?.user?.id) {
      setError("You must be logged in to vote");
      return;
    }

    if (hasVoted) {
      setError("You have already voted for this YouTuber");
      return;
    }

    setVoting(true);
    setError("");

    try {
      await voteForYouTuber(session.user.id, youtuber.id);
      onVote(youtuber.id);
    } catch (err) {
      setError("Failed to vote. Please try again.");
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="card bg-white overflow-hidden rounded-lg transition-all shadow-card border border-primary-100">
      <div className="aspect-video relative">
        <Image
          src={
            youtuber.image_url ||
            "https://via.placeholder.com/640x360?text=No+Image"
          }
          alt={youtuber.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold mb-1">{youtuber.name}</h3>
        <a
          href={youtuber.channel_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 hover:text-primary-800 text-sm mb-3 inline-block"
        >
          View Channel
        </a>

        {youtuber.description && (
          <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">
            {youtuber.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
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
              className="text-primary-400 mr-1"
            >
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            <span className="text-primary-700 font-medium">
              {youtuber.vote_count}
            </span>
          </div>

          <button
            onClick={handleVote}
            disabled={hasVoted || voting || !session}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              hasVoted
                ? "bg-primary-50 text-primary-700 border border-primary-200"
                : session
                ? "bg-primary-500 hover:bg-primary-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {voting ? "Voting..." : hasVoted ? "Voted" : "Vote"}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
}
