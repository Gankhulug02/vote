import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import YouTuberForm from "@/components/YouTuberForm";
import { getYouTuber } from "@/lib/supabase";

// List of admin emails
const ADMIN_EMAILS = ["huluguu0202@gmail.com"]; // Replace with actual admin email

export const metadata = {
  title: "Edit YouTuber - Admin Dashboard",
  description: "Edit a YouTuber on the VoteYT platform",
};

export default async function EditYouTuber({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const session = await auth();

  // Check if user is authenticated and has admin rights
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/");
  }

  // Get the YouTuber data
  const youtuber = await getYouTuber(param.id as string);

  // If YouTuber not found, redirect to admin page
  if (!youtuber) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header session={session} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit YouTuber</h1>
            <p className="text-muted-foreground mt-2">
              Update information for {youtuber.name}
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <YouTuberForm youtuber={youtuber} isEditing={true} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
