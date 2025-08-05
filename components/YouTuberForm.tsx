"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { YouTuber } from "@/lib/supabase";

interface YouTuberFormProps {
  youtuber?: YouTuber;
  isEditing?: boolean;
}

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

  // Form fields
  const [formData, setFormData] = useState({
    name: youtuber?.name || "",
    channel_url: youtuber?.channel_url || "",
    image_url: youtuber?.image_url || "",
    description: youtuber?.description || "",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.channel_url.trim()) {
        throw new Error("Name and Channel URL are required");
      }

      // Check if the channel URL is valid
      try {
        new URL(formData.channel_url);
      } catch {
        throw new Error("Please enter a valid URL for the channel");
      }

      // Check if image URL is valid (if provided)
      if (formData.image_url && formData.image_url.trim() !== "") {
        try {
          new URL(formData.image_url);
        } catch {
          throw new Error("Please enter a valid URL for the image");
        }
      }

      if (isEditing && youtuber) {
        // Update existing YouTuber
        const { error } = await supabase
          .from("youtubers")
          .update({
            name: formData.name,
            channel_url: formData.channel_url,
            image_url: formData.image_url || null,
            description: formData.description || null,
          })
          .eq("id", youtuber.id);

        if (error) throw error;

        setMessage({ text: "YouTuber updated successfully!", type: "success" });

        // Navigate back to admin page after 2 seconds
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        // Add new YouTuber
        const { error } = await supabase.from("youtubers").insert([
          {
            name: formData.name,
            channel_url: formData.channel_url,
            image_url: formData.image_url || null,
            description: formData.description || null,
          },
        ]);

        if (error) throw error;

        // Reset form and show success message
        setFormData({
          name: "",
          channel_url: "",
          image_url: "",
          description: "",
        });

        setMessage({ text: "YouTuber added successfully!", type: "success" });

        // Navigate back to admin page after 2 seconds
        setTimeout(() => router.push("/admin"), 2000);
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter YouTuber name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="channel_url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Channel URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="channel_url"
            name="channel_url"
            value={formData.channel_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://youtube.com/channel/..."
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave empty to use a default image
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter a description for this YouTuber..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update YouTuber"
              : "Add YouTuber"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
