import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type YouTuber = {
  id: string;
  created_at: string;
  name: string;
  channel_url: string;
  image_url: string;
  description: string;
  vote_count: number;
};

export type Vote = {
  id: string;
  created_at: string;
  user_id: string;
  youtuber_id: string;
};

// Check if user has already voted for this YouTuber
export async function hasUserVoted(
  userId: string,
  youtuberId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", userId)
    .eq("youtuber_id", youtuberId)
    .single();

  if (error) return false;
  return !!data;
}

// Get all YouTubers sorted by vote count
export async function getYouTubers(): Promise<YouTuber[]> {
  const { data, error } = await supabase
    .from("youtubers")
    .select("*")
    .order("vote_count", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get a specific YouTuber
export async function getYouTuber(id: string): Promise<YouTuber | null> {
  const { data, error } = await supabase
    .from("youtubers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// Vote for a YouTuber
export async function voteForYouTuber(
  userId: string,
  youtuberId: string
): Promise<boolean> {
  // Check if already voted
  const alreadyVoted = await hasUserVoted(userId, youtuberId);
  if (alreadyVoted) return false;

  // Add vote and increment vote_count
  const { error: voteError } = await supabase
    .from("votes")
    .insert([{ user_id: userId, youtuber_id: youtuberId }]);

  if (voteError) return false;

  // Update the vote count
  const { error: updateError } = await supabase.rpc("increment_vote_count", {
    youtuber_id: youtuberId,
  });

  return !updateError;
}

// Get user's votes
export async function getUserVotes(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("votes")
    .select("youtuber_id")
    .eq("user_id", userId);

  if (error) return [];
  return data.map((vote) => vote.youtuber_id);
}
