"use client";

import { useState, useEffect } from "react";
import { User, UserRole, getAllUsers, updateUserRole } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

export function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const fetchedUsers = await getAllUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    if (userId === session?.user?.id && newRole === "user") {
      alert("You cannot remove your own admin privileges!");
      return;
    }

    setUpdatingRole(userId);
    const success = await updateUserRole(userId, newRole);

    if (success) {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } else {
      alert("Failed to update user role");
    }

    setUpdatingRole(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions. Be careful when changing admin
          roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {user.image_url && (
                  <img
                    src={user.image_url}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">
                    {user.name || "Unknown"}
                    {user.id === session?.user?.id && (
                      <span className="text-xs text-gray-500 ml-2">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>

                {session?.user?.role === "admin" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={user.role === "user" ? "default" : "outline"}
                      onClick={() => handleRoleUpdate(user.id, "user")}
                      disabled={
                        updatingRole === user.id || user.role === "user"
                      }
                    >
                      {updatingRole === user.id ? "..." : "User"}
                    </Button>
                    <Button
                      size="sm"
                      variant={user.role === "admin" ? "default" : "outline"}
                      onClick={() => handleRoleUpdate(user.id, "admin")}
                      disabled={
                        updatingRole === user.id || user.role === "admin"
                      }
                    >
                      {updatingRole === user.id ? "..." : "Admin"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
