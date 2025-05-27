// components/note/index.tsx
import NoteForm from "@/components/note/NoteForm";
import NoteSummary from "@/components/note/NoteSummary";
import NoteViewerPanel from "@/components/note/NoteViewerPanel";
import NotePlaceholder from "@/components/note/NotePlaceholder";

import FollowUpForm from "@/components/note/FollowUpForm";
import { useNotes } from "@/app/hooks/useNotes";
import { useEffect } from "react";

export default function NoteLayout({ selectedNote }: { selectedNote: any }) {
  const {
    isFollowUpMode,
    fetchNotes,
    setEditorVisible,
    setFollowUpMode,
    setTempNotes,
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
        {isFollowUpMode ? (
          <FollowUpForm onSubmit={() => {}} isAsking={false} />
        ) : (
          <NoteForm onNoteGenerated={() => {}} />
        )}
        <NoteSummary />
      </div>

      {/* Right column */}
      <div className="lg:col-span-2">
        {selectedNote ? <NoteViewerPanel /> : <NotePlaceholder />}
      </div>
    </div>
  );
}
