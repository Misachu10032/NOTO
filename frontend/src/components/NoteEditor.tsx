'use client';

import { useState } from 'react';

interface NoteEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isSaving: boolean;
}

export default function NoteEditor({
  content,
  onContentChange,
  isSaving,
}: NoteEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-full p-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          placeholder="Start writing your note here..."
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
