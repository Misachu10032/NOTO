// components/note/index.tsx
import NoteForm from "@/components/note/NoteForm";
import NoteSummary from "@/components/note/NoteSummary";
import NoteViewerPanel from "@/components/note/NoteViewerPanel";
import NotePlaceholder from "@/components/note/NotePlaceholder";

export default function NoteLayout({ selectedNote }: { selectedNote: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column */}
      <div className="lg:col-span-1 space-y-4">
        <NoteForm onNoteGenerated={() => {}} />
        <NoteSummary />
      </div>

      {/* Right column */}
      <div className="lg:col-span-2">
        {selectedNote ? <NoteViewerPanel /> : <NotePlaceholder />}
      </div>
    </div>
  );
}
