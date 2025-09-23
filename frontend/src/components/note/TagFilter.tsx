"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSelectedTag } from "@/app/store/slices/notesSlice";

export default function TagFilter() {
  const dispatch = useAppDispatch();
  const { notes, selectedTag } = useAppSelector((state) => state.notes);

  // Collect unique tags from all notes
  const uniqueTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || []))
  );

  if (uniqueTags.length === 0) return null; // No tags to display

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3">Filter by Tag</h2>
      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              dispatch(setSelectedTag(selectedTag === tag ? null : tag))
            }
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedTag === tag
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
        {selectedTag && (
          <button
            onClick={() => dispatch(setSelectedTag(null))}
            className="px-3 py-1 text-sm text-gray-500 hover:text-red-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
