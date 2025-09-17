"use client";

import Header from "@/components/Header";
import NoteLayout from "@/components/note";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NoteLayout />
      </main>
    </div>
  );
}
