"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  image_url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

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
      image_url: youtuber?.image_url || "",
      description: youtuber?.description || "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      if (isEditing && youtuber) {
        // Update existing YouTuber
        const { error } = await supabase
          .from("youtubers")
          .update({
            name: data.name,
            channel_url: data.channel_url,
            image_url: data.image_url || null,
            description: data.description || null,
          })
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
            image_url: data.image_url || null,
            description: data.description || null,
          },
        ]);

        if (error) throw error;

        // Reset form
        form.reset({
          name: "",
          channel_url: "",
          image_url: "",
          description: "",
        });

        setMessage({ text: "YouTuber added successfully!", type: "success" });

        // Navigate back to admin page after 1.5 seconds
        setTimeout(() => router.push("/admin"), 1500);
      }
    } catch (error: any) {
      console.error("Error saving YouTuber:", error);
      setMessage({
        text: error.message || "Failed to save YouTuber",
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
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty to use a default image
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
