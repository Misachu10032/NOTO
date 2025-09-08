"use client";

import { useNotes } from "@/app/hooks/useNotes";
import NoteLayout from "@/components/Note";


export default function Home() {
  const { selectedNote } = useNotes();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Note Generator</h1>
        <NoteLayout selectedNote={selectedNote} />
      </div>
    </div>
  );
}
