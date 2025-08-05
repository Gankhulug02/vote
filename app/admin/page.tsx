import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getYouTubers } from "@/lib/supabase";
import Image from "next/image";
import { AuthButton } from "@/components/AuthButton";
import AdminYouTuberList from "@/components/AdminYouTuberList";

// List of admin emails
const ADMIN_EMAILS = ["huluguu0202@gmail.com"]; // Replace with actual admin email

export default async function AdminPage() {
  const session = await auth();

  // Check if user is authenticated and has admin rights
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/");
  }

  const youtubers = await getYouTubers();

  return (
    <div className="font-sans min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
            <span className="text-lg font-bold">YouTuber Voting - Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-primary-600 font-bold">
                    Admin
                  </Link>
                </li>
              </ul>
            </nav>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage YouTubers</h1>
          <Link
            href="/admin/add"
            className="px-5 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Add New YouTuber
          </Link>
        </div>

        <AdminYouTuberList youtubers={youtubers} />
      </main>
    </div>
  );
}
