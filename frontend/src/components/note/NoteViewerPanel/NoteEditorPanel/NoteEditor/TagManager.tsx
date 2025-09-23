"use client";

import { useState } from "react";

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export default function TagManager({ tags, onChange, disabled }: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onChange([...tags, newTag.trim()]);
    }
    setNewTag("");
    setIsAdding(false);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Tags</label>

      {/* Tag List + Toggle Button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
                <button
                  type="button"
                  className="text-blue-500 hover:text-red-500"
                  onClick={() => removeTag(i)}
                  disabled={disabled}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">No tags</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding((prev) => !prev);
            setNewTag("");
          }}
          disabled={disabled}
          className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isAdding ? "−" : "+"}
        </button>
      </div>

      {/* Input for new tag */}
      {isAdding && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              } else if (e.key === "Escape") {
                setNewTag("");
                setIsAdding(false);
              }
            }}
            autoFocus
            placeholder="Type a tag and press Enter"
            className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={disabled}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
