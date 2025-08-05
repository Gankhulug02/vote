"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, uploadImage } from "@/lib/supabase";
import type { YouTuber } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface YouTuberFormProps {
  youtuber?: YouTuber;
  isEditing?: boolean;
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  channel_url: z
    .string()
    .min(1, { message: "Channel URL is required" })
    .url({ message: "Please enter a valid URL" }),
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return file.size <= 5 * 1024 * 1024; // 5MB limit
      },
      { message: "File size must be less than 5MB" }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        );
      },
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
  description: z.string().optional().or(z.literal("")),
});

type FormValues = {
  name: string;
  channel_url: string;
  image?: unknown; // File input value
  description?: string;
};

export default function YouTuberForm({
  youtuber,
  isEditing = false,
}: YouTuberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: youtuber?.name || "",
      channel_url: youtuber?.channel_url || "",
      description: youtuber?.description || "",
    },
  });

  // Type guard to check if value is FileList-like
  const isFileListLike = (
    value: unknown
  ): value is { length: number; [index: number]: File } => {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const obj = value as Record<string, unknown>;
    return "length" in obj && typeof obj.length === "number" && obj.length > 0;
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl: string | null = null;

      // Handle image upload if a file is selected
      if (data.image && isFileListLike(data.image)) {
        const file = data.image[0];

        try {
          // Upload the image (everyone is allowed since policies are permissive)
          imageUrl = await uploadImage(file);
          console.log("imageUrl", imageUrl);
          if (!imageUrl) {
            throw new Error("Failed to upload image - upload returned null");
          }
        } catch (uploadError) {
          console.log("Upload error details:", uploadError);

          if (uploadError instanceof Error) {
            if (uploadError.message.includes("row-level security policy")) {
              throw new Error(
                "Permission denied: Please ensure storage policies are set up correctly. " +
                  "Contact administrator if this persists."
              );
            } else if (uploadError.message.includes("JWT")) {
              throw new Error(
                "Authentication error: Please sign out and sign back in, then try again."
              );
            } else {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }
          } else {
            throw new Error("Failed to upload image - unknown error");
          }
        }
      }

      if (isEditing && youtuber) {
        // Update existing YouTuber
        const updateData: {
          name: string;
          channel_url: string;
          description: string | null;
          image_url?: string;
        } = {
          name: data.name,
          channel_url: data.channel_url,
          description: data.description || null,
        };

        // Only update image_url if a new image was uploaded
        if (imageUrl) {
          updateData.image_url = imageUrl;
        }

        const { error } = await supabase
          .from("youtubers")
          .update(updateData)
          .eq("id", youtuber.id);

        if (error) throw error;

        setMessage({ text: "YouTuber updated successfully!", type: "success" });

        // Navigate back to admin page after 1.5 seconds
        setTimeout(() => router.push("/admin"), 1500);
      } else {
        // Add new YouTuber
        const { error } = await supabase.from("youtubers").insert([
          {
            name: data.name,
            channel_url: data.channel_url,
            image_url: imageUrl,
            description: data.description || null,
          },
        ]);

        if (error) throw error;

        // Reset form
        form.reset({
          name: "",
          channel_url: "",
          description: "",
        });

        setMessage({ text: "YouTuber added successfully!", type: "success" });

        // Navigate back to admin page after 1.5 seconds
        setTimeout(() => router.push("/admin"), 1500);
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save YouTuber";
      console.log("Error saving YouTuber:", error);
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          className="mb-6"
        >
          <AlertTitle>
            {message.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter YouTuber name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="channel_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://youtube.com/channel/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                    value={undefined}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image (JPEG, PNG, or WebP). Maximum file size: 5MB.
                  Leave empty to keep existing image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Enter a description for this YouTuber..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading
                ? "Saving..."
                : isEditing
                ? "Update YouTuber"
                : "Add YouTuber"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
