"use client";

import { useSession } from "next-auth/react";
import NoteForm from "@/components/note/NoteForm";
import NoteSummary from "@/components/note/NoteSummary";
import NoteViewerPanel from "@/components/note/NoteViewerPanel";
import NotePlaceholder from "@/components/note/NotePlaceholder";
import { useNotes } from "@/app/hooks/useNotes";
import { useEffect } from "react";
import TagFilter from "./TagFilter";

export default function NoteLayout() {
  const { data: session } = useSession();
  const { fetchNotes, setEditorVisible, selectedNote, handleNoteGenerated } =
    useNotes();


  useEffect(() => {
    if (session?.user?.userId) {
      fetchNotes();
      console.log("Notes fetched");
    }
    // eslint-disable-next-line
  }, [session]);

  return (
    <div className="relative">
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <NoteForm onNoteGenerated={handleNoteGenerated} />
          <TagFilter/>
          <NoteSummary />
        </div>

        <div className="lg:col-span-2">
          {selectedNote ? <NoteViewerPanel /> : <NotePlaceholder />}
        </div>
      </div>
    </div>
  );
}
