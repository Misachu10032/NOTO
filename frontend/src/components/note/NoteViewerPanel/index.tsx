import { useNotes } from "@/app/hooks/useNotes";
import MarkdownViewer from "@/components/note/NoteViewerPanel/MarkDownViewer";
import NoteEditorPanel from "./NoteEditorPanel";

export default function NoteViewerPanel() {
  const {
    selectedNote,
    tempNote,
    isEditorVisible,
    setEditorVisible,
  } = useNotes();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold break-words whitespace-normal">
            {selectedNote?.keyword}
          </h2>
          {!isEditorVisible && (
            <button
              onClick={() => setEditorVisible(true)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.793.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <MarkdownViewer content={tempNote.content} />
        </div>
      </div>

      {isEditorVisible ? <NoteEditorPanel /> : <div className="p-4" />}
    </div>
  );
}
