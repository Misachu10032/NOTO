"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">
            Note Generator
          </h1>

          {/* Login / Logout Button */}
          {session ? (
            <div className="flex items-center space-x-3">
              {/* Optional: Show user avatar if available */}
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl shadow hover:bg-gray-200 transition"
              >
                Logout ({session.user?.name})
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
            >
              Login with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
