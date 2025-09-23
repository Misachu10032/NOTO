"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSelectedTags, setFilterMode } from "@/app/store/slices/notesSlice";

export default function TagFilter() {
  const dispatch = useAppDispatch();
  const { notes, selectedTags, filterMode } = useAppSelector(
    (state) => state.notes
  );

  // Collect unique tags from all notes
  const uniqueTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));
  const tagsToDisplay = uniqueTags.length > 0 ? uniqueTags : ["No tag"];

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (tag === "No tag") return;
    if (selectedTags.includes(tag)) {
      dispatch(setSelectedTags(selectedTags.filter((t) => t !== tag)));
    } else {
      dispatch(setSelectedTags([...selectedTags, tag]));
    }
  };

  // Clear all selected tags
  const clearTags = () => dispatch(setSelectedTags([]));

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      {/* Title + AND/OR dropdown on the same row */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Filter by Tag</h2>
        <select
          value={filterMode}
          onChange={(e) =>
            dispatch(setFilterMode(e.target.value as "AND" | "OR"))
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="OR">OR</option>
          <option value="AND">AND</option>
        </select>
      </div>

      {/* Tag buttons */}
      <div className="flex flex-wrap gap-2">
        {tagsToDisplay.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            disabled={tag === "No tag"}
          >
            {tag}
          </button>
        ))}

        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="px-3 py-1 text-sm text-gray-500 hover:text-red-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
