"use client";

import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { setError } from "@/app/store/slices/notesSlice";

interface NoteFormProps {
  onNoteGenerated: (keyword: string, content: string) => void;
}

export default function NoteForm({ onNoteGenerated }: NoteFormProps) {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      dispatch(setError("Please enter a keyword"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: trimmedKeyword }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate note");
      }

      const data = await response.json();
      onNoteGenerated(trimmedKeyword, data.content);
      setKeyword("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch(setError(errorMessage));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Generate a Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="keyword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter a keyword or topic
          </label>
          <div className="flex items-center space-x-2">
            <textarea
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
              placeholder="e.g., Quantum Computing"
              disabled={isLoading}
              rows={3}
              maxLength={300}
            />
            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
            >
              {isLoading ? "..." : "Go"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
