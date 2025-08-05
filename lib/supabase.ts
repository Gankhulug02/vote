import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for operations that need elevated permissions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

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

export type VoteWithDetails = {
  id: string;
  created_at: string;
  user_id: string;
  youtuber_id: string;
  youtuber: YouTuber;
  user: Pick<User, "id" | "name" | "email" | "image_url">;
};

export type YouTuberWithVoteDetails = YouTuber & {
  votes: Array<{
    id: string;
    created_at: string;
    user: Pick<User, "id" | "name" | "email" | "image_url">;
  }>;
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

// Get all YouTubers sorted by vote count (calculated from votes table)
export async function getYouTubers(): Promise<YouTuber[]> {
  const { data, error } = await supabase.from("youtubers").select(`
      id,
      created_at,
      name,
      channel_url,
      image_url,
      description,
      vote_count:votes!youtuber_id(count)
    `);

  if (error) throw error;

  // Transform the data to flatten vote_count and sort by vote count
  const transformedData = (data || [])
    .map((youtuber) => ({
      ...youtuber,
      vote_count: youtuber.vote_count?.[0]?.count || 0,
    }))
    .sort((a, b) => b.vote_count - a.vote_count);

  return transformedData;
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

  // Add vote (vote count will be calculated dynamically)
  const { error: voteError } = await supabase
    .from("votes")
    .insert([{ user_id: userId, youtuber_id: youtuberId }]);

  if (voteError) return { success: false, error: "Failed to save vote" };

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

// Get user's votes with full details (joined with YouTuber data)
export async function getUserVotesWithDetails(
  userId: string
): Promise<VoteWithDetails[]> {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `
      id,
      created_at,
      user_id,
      youtuber_id,
      youtubers (
        id,
        created_at,
        name,
        channel_url,
        image_url,
        description,
        vote_count
      ),
      users (
        id,
        name,
        email,
        image_url
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user votes with details:", error);
    return [];
  }

  // Transform the data to match our type structure
  const transformedData =
    data?.map((vote) => ({
      id: vote.id,
      created_at: vote.created_at,
      user_id: vote.user_id,
      youtuber_id: vote.youtuber_id,
      youtuber: (Array.isArray(vote.youtubers)
        ? vote.youtubers[0]
        : vote.youtubers) as YouTuber,
      user: (Array.isArray(vote.users) ? vote.users[0] : vote.users) as Pick<
        User,
        "id" | "name" | "email" | "image_url"
      >,
    })) || [];

  return transformedData;
}

// Get all votes for a specific YouTuber with user details
export async function getYouTuberVotes(
  youtuberId: string
): Promise<VoteWithDetails[]> {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `
      id,
      created_at,
      user_id,
      youtuber_id,
      youtubers (
        id,
        created_at,
        name,
        channel_url,
        image_url,
        description,
        vote_count
      ),
      users (
        id,
        name,
        email,
        image_url
      )
    `
    )
    .eq("youtuber_id", youtuberId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching YouTuber votes:", error);
    return [];
  }

  // Transform the data to match our type structure
  const transformedData =
    data?.map((vote) => ({
      id: vote.id,
      created_at: vote.created_at,
      user_id: vote.user_id,
      youtuber_id: vote.youtuber_id,
      youtuber: (Array.isArray(vote.youtubers)
        ? vote.youtubers[0]
        : vote.youtubers) as YouTuber,
      user: (Array.isArray(vote.users) ? vote.users[0] : vote.users) as Pick<
        User,
        "id" | "name" | "email" | "image_url"
      >,
    })) || [];

  return transformedData;
}

// Get YouTubers with their vote details
export async function getYouTubersWithVoteDetails(): Promise<
  YouTuberWithVoteDetails[]
> {
  const { data, error } = await supabase
    .from("youtubers")
    .select(
      `
      id,
      created_at,
      name,
      channel_url,
      image_url,
      description,
      vote_count,
      votes (
        id,
        created_at,
        users (
          id,
          name,
          email,
          image_url
        )
      )
    `
    )
    .order("vote_count", { ascending: false });

  if (error) {
    console.error("Error fetching YouTubers with vote details:", error);
    return [];
  }

  // Transform the data to match our type structure
  const transformedData =
    data?.map((youtuber) => ({
      ...youtuber,
      votes: youtuber.votes.map((vote) => ({
        id: vote.id,
        created_at: vote.created_at,
        user: (Array.isArray(vote.users) ? vote.users[0] : vote.users) as Pick<
          User,
          "id" | "name" | "email" | "image_url"
        >,
      })),
    })) || [];

  return transformedData;
}

// Get all votes with full details (admin function)
export async function getAllVotesWithDetails(): Promise<VoteWithDetails[]> {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `
      id,
      created_at,
      user_id,
      youtuber_id,
      youtubers (
        id,
        created_at,
        name,
        channel_url,
        image_url,
        description,
        vote_count
      ),
      users (
        id,
        name,
        email,
        image_url
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all votes with details:", error);
    return [];
  }

  // Transform the data to match our type structure
  const transformedData =
    data?.map((vote) => ({
      id: vote.id,
      created_at: vote.created_at,
      user_id: vote.user_id,
      youtuber_id: vote.youtuber_id,
      youtuber: (Array.isArray(vote.youtubers)
        ? vote.youtubers[0]
        : vote.youtubers) as YouTuber,
      user: (Array.isArray(vote.users) ? vote.users[0] : vote.users) as Pick<
        User,
        "id" | "name" | "email" | "image_url"
      >,
    })) || [];

  return transformedData;
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
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    console.log("Error creating/updating user:", error);
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

// Storage helpers for image uploads
export async function ensureImagesBucketExists(): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }

    const imagesBucket = buckets?.find((bucket) => bucket.name === "images");

    if (!imagesBucket) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(
        "images",
        {
          public: true,
          allowedMimeTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ],
          fileSizeLimit: 5242880, // 5MB in bytes
        }
      );

      if (createError) {
        console.error("Error creating images bucket:", createError);
        return false;
      }

      console.log("Images bucket created successfully");
    }

    return true;
  } catch (error) {
    console.error("Error in ensureImagesBucketExists:", error);
    return false;
  }
}

export async function uploadImage(
  file: File,
  folder: string = "youtuber-images",
  useAdminClient: boolean = false
): Promise<string | null> {
  try {
    // Choose which client to use
    const client = useAdminClient ? supabaseAdmin : supabase;
    console.log("client", client);

    // Note: Make sure the 'images' bucket exists in your Supabase dashboard
    console.log("Uploading with client:", useAdminClient ? "admin" : "regular");

    // Create a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log("Uploading file:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadPath: filePath,
    });

    // Upload file to Supabase storage
    const { error } = await client.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      throw error; // Throw error instead of returning null to preserve error details
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from("images")
      .getPublicUrl(filePath);
    console.log("filePath", filePath);
    console.log("publicUrlData", publicUrlData);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.log("Error in uploadImage:", error);
    throw error; // Re-throw to allow better error handling upstream
  }
}
