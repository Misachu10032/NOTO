// components/note/index.tsx
import NoteForm from "@/components/Note/NoteForm";
import NoteSummary from "@/components/Note/NoteSummary";
import NoteViewerPanel from "@/components/Note/NoteViewerPanel";
import NotePlaceholder from "@/components/Note/NotePlaceholder";

import FollowUpForm from "@/components/Note/FollowUpForm";
import { useNotes } from "@/app/hooks/useNotes";
import { useEffect } from "react";

export default function NoteLayout({ selectedNote }: { selectedNote: any }) {
  
  const {
    isFollowUpMode,
    fetchNotes,
    setEditorVisible,
    setFollowUpMode,
    setTempNotes,
    handleNoteGenerated,
  } = useNotes();

  useEffect(() => {
    fetchNotes();
    console.log("Notes fetched");
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (selectedNote) {
      setEditorVisible(false);
      setFollowUpMode(false);
      setTempNotes([
        {
          id: selectedNote.id,
          keyword: selectedNote.keyword,
          content: selectedNote.content,
          followupQuestions: [],
          followupAnswers: [],
        },
      ]);
    }
  }, [selectedNote]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column */}
      <div className="lg:col-span-1 space-y-4">
    
          <NoteForm onNoteGenerated={handleNoteGenerated} />

        <NoteSummary />
      </div>

      {/* Right column */}
      <div className="lg:col-span-2">
        {selectedNote ? <NoteViewerPanel /> : <NotePlaceholder />}
      </div>
    </div>
  );
}
