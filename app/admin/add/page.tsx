import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import YouTuberForm from "@/components/YouTuberForm";

// List of admin emails
const ADMIN_EMAILS = ["huluguu0202@gmail.com"]; // Replace with actual admin email

export const metadata = {
  title: "Add YouTuber - Admin Dashboard",
  description: "Add a new YouTuber to the YoutubeChamp platform",
};

export default async function AddYouTuber() {
  const session = await auth();

  // Check if user is authenticated and has admin rights
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Add New YouTuber</h1>
            <p className="text-muted-foreground mt-2">
              Add a new YouTuber to the voting platform.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <YouTuberForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
