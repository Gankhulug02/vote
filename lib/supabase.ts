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

export type User = {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  image_url: string | null;
  role: "admin" | "user";
};

export type UserRole = "admin" | "user";

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
): Promise<{ success: boolean; error?: string }> {
  // Check if already voted for this specific YouTuber
  const alreadyVoted = await hasUserVoted(userId, youtuberId);
  if (alreadyVoted)
    return {
      success: false,
      error: "You have already voted for this YouTuber",
    };

  // Check if user has reached the 3-vote limit
  const userVotes = await getUserVotes(userId);
  if (userVotes.length >= 3) {
    return { success: false, error: "You have reached the maximum of 3 votes" };
  }

  // Add vote and increment vote_count
  const { error: voteError } = await supabase
    .from("votes")
    .insert([{ user_id: userId, youtuber_id: youtuberId }]);

  if (voteError) return { success: false, error: "Failed to save vote" };

  // Update the vote count
  const { error: updateError } = await supabase.rpc("increment_vote_count", {
    youtuber_id: youtuberId,
  });

  if (updateError)
    return { success: false, error: "Failed to update vote count" };

  return { success: true };
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

// User management functions
export async function createOrUpdateUser(userInfo: {
  id: string;
  email: string;
  name?: string | null;
  image_url?: string | null;
}): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        image_url: userInfo.image_url,
        role: "user", // Default role
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error creating/updating user:", error);
    return null;
  }
  return data;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data.role;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  return !error;
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin";
}
