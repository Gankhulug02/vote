import { auth } from "@/auth";
import Link from "next/link";
import { getYouTubers } from "@/lib/supabase";
import { Footer } from "@/components/Footer";
import AdminYouTuberList from "@/components/AdminYouTuberList";
import { UserManagement } from "@/components/UserManagement";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Admin Dashboard - VoteYT",
  description: "Admin dashboard for managing YouTubers and users on VoteYT",
};

export default async function AdminPage() {
  const session = await auth();

  // Note: Role-based access is now handled by middleware in auth.ts
  // This page will only be accessible to users with admin role

  const youtubers = await getYouTubers();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage YouTubers, users, and platform settings
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Welcome back, {session?.user?.name || session?.user?.email}
            </p>
          </div>

          <Tabs defaultValue="youtubers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="youtubers">YouTubers</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="youtubers" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Manage YouTubers</h2>
                  <p className="text-muted-foreground">
                    Add, edit, or remove content creators from the platform
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/add">Add New YouTuber</Link>
                </Button>
              </div>
              <AdminYouTuberList youtubers={youtubers} />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Manage Users</h2>
                <p className="text-muted-foreground">
                  View and manage user roles and permissions
                </p>
              </div>
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
