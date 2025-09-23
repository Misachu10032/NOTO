import { useNotes } from "@/app/hooks/useNotes";
import NoteEditor from "./NoteEditor";
import { TempNote } from "../../../../app/store/slices/notesSlice";

export default function NoteEditorPanel(tempNote: TempNote) {
  const {
    setEditorVisible,
    updateTempNoteContent,
    handleSaveNote,
  } = useNotes();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Editor</h2>
        <button
          onClick={() => setEditorVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <NoteEditor
          keyword={tempNote.keyword}
          content={tempNote.content}
          tags={tempNote.tags}
          onSave={({ keyword, content, tags }) => handleSaveNote({ keyword, content, tags })}
          isSaving={false}
        />
      </div>
    </div>
  );
}
