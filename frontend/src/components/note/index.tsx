// components/note/index.tsx
import NoteForm from "@/components/note/NoteForm";
import NoteSummary from "@/components/note/NoteSummary";
import NoteViewerPanel from "@/components/note/NoteViewerPanel";
import NotePlaceholder from "@/components/note/NotePlaceholder";

import FollowUpForm from "@/components/note/FollowUpForm";
import { useNotes } from "@/app/hooks/useNotes";

export default function NoteLayout({ selectedNote }: { selectedNote: any }) {
  const { isFollowUpMode } = useNotes();
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
