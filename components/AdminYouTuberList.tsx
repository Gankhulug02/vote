"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { YouTuber } from "@/lib/supabase";

interface AdminYouTuberListProps {
  youtubers: YouTuber[];
}

export default function AdminYouTuberList({
  youtubers: initialYoutubers,
}: AdminYouTuberListProps) {
  const [youtubers, setYoutubers] = useState(initialYoutubers);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Filter by search query
  const filteredYoutubers = youtubers.filter((youtuber) =>
    youtuber.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    // Confirm deletion
    if (
      !window.confirm(
        "Are you sure you want to delete this YouTuber? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      // Delete the YouTuber from Supabase
      const { error } = await supabase.from("youtubers").delete().eq("id", id);

      if (error) throw error;

      // Update local state to remove deleted YouTuber
      setYoutubers((prev) => prev.filter((youtuber) => youtuber.id !== id));
      setMessage({ text: "YouTuber deleted successfully", type: "success" });
    } catch (error) {
      console.log("Error deleting YouTuber:", error);
      setMessage({ text: "Failed to delete YouTuber", type: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search YouTubers..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                YouTuber
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Channel
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Votes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredYoutubers.map((youtuber) => (
              <tr key={youtuber.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 relative flex-shrink-0">
                      <Image
                        className="rounded-full object-cover"
                        src={
                          youtuber.image_url || "https://via.placeholder.com/40"
                        }
                        alt={youtuber.name}
                        fill
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {youtuber.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                  <a
                    href={youtuber.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Channel
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                  {youtuber.vote_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/edit/${youtuber.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(youtuber.id)}
                      disabled={loading[youtuber.id]}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {loading[youtuber.id] ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredYoutubers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                >
                  {searchQuery
                    ? "No YouTubers match your search."
                    : "No YouTubers have been added yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
