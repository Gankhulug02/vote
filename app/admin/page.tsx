import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getYouTubers } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AdminYouTuberList from "@/components/AdminYouTuberList";
import { Button } from "@/components/ui/button";

// List of admin emails
const ADMIN_EMAILS = ["huluguu0202@gmail.com"]; // Replace with actual admin email

export const metadata = {
  title: "Admin Dashboard - VoteYT",
  description: "Admin dashboard for managing YouTubers on VoteYT",
};

export default async function AdminPage() {
  const session = await auth();

  // Check if user is authenticated and has admin rights
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/");
  }

  const youtubers = await getYouTubers();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage YouTubers</h1>
              <p className="text-muted-foreground mt-1">
                Add, edit, or remove content creators from the platform
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/add">Add New YouTuber</Link>
            </Button>
          </div>

          <AdminYouTuberList youtubers={youtubers} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
