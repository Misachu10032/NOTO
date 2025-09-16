"use client";

import { useSession } from "next-auth/react";
import NoteForm from "@/components/note/NoteForm";
import NoteSummary from "@/components/note/NoteSummary";
import NoteViewerPanel from "@/components/note/NoteViewerPanel";
import NotePlaceholder from "@/components/note/NotePlaceholder";
import { useNotes } from "@/app/hooks/useNotes";
import { useEffect } from "react";

export default function NoteLayout() {
  const { data: session } = useSession();
  const {
    fetchNotes,
    setEditorVisible,
    selectedNote,
    handleNoteGenerated,
  } = useNotes();

  useEffect(() => {
    fetchNotes();
    console.log("Notes fetched");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedNote) setEditorVisible(false);
  }, [selectedNote]);

  return (
    <div className="relative">
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <NoteForm onNoteGenerated={handleNoteGenerated} />
          <NoteSummary />
        </div>

        <div className="lg:col-span-2">
          {selectedNote ? <NoteViewerPanel /> : <NotePlaceholder />}
        </div>
      </div>
    </div>
  );
}
