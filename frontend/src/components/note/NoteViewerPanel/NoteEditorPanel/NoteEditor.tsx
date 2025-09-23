'use client';

import { useState } from 'react';

interface NoteEditorProps {
  content: string;
  keyword: string;
  onSave: (data: { keyword: string; content: string }) => void;
  isSaving: boolean;
}

export default function NoteEditor({
  content: initialContent,
  keyword: initialKeyword,
  onSave,
  isSaving,
}: NoteEditorProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [content, setContent] = useState(initialContent);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Keyword Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Keyword</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter keyword"
          disabled={isSaving}
        />
      </div>

      {/* Content Field */}
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full min-h-[200px] p-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          placeholder="Write your note here..."
          disabled={isSaving}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave({ keyword, content })}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
