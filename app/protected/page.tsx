import { auth } from "@/auth";
import Link from "next/link";

export default async function ProtectedPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
        <div className="mb-6">
          <p className="mb-2">You are signed in as:</p>
          <div className="p-4 bg-gray-100 rounded-md">
            <p>
              <strong>Name:</strong> {session?.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {session?.user?.email}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="block w-full text-center py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
