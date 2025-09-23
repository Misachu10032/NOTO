"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSelectedNote, deleteNote } from "@/app/store/slices/notesSlice";
import { Note } from "@/app/store/slices/notesSlice";

export default function NoteSummary() {
  const dispatch = useAppDispatch();
  const { notes, selectedNote, selectedTags, filterMode } = useAppSelector(
    (state) => state.notes
  );

  // Filter notes based on selectedTags and filterMode
  const filteredNotes = notes.filter((note: Note) => {
    if (selectedTags.length === 0) return true; // no filter applied

    const noteTags = note.tags || [];
    if (filterMode === "AND") {
      // All selectedTags must be present in note.tags
      return selectedTags.every((tag) => noteTags.includes(tag));
    } else {
      // OR mode: at least one selectedTag is in note.tags
      return selectedTags.some((tag) => noteTags.includes(tag));
    }
  });

  const handleDelete = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/notes/${noteId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        dispatch(deleteNote(noteId));
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3">My Notes</h2>
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-sm">No notes match your filter.</p>
      ) : (
        <ul className="space-y-2">
          {filteredNotes.map((note: Note) => (
            <li
              key={note.id}
              onClick={() => dispatch(setSelectedNote(note))}
              className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                selectedNote?.id === note.id
                  ? "bg-blue-50 border border-blue-200"
                  : note.saved
                  ? "bg-gray-50 border border-gray-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <span className="truncate">{note.keyword}</span>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                className="text-gray-400 hover:text-red-500 text-sm"
                title="Delete note"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
