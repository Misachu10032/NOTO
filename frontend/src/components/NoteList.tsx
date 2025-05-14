'use client';

import { useState } from 'react';

interface Note {
  id: number;
  keyword: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: number) => void;
}

export default function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  const toggleExpand = (noteId: number) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  if (notes.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500">No notes yet. Generate your first note above!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Notes</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{note.keyword}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(note)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-gray-700">
                {expandedNoteId === note.id
                  ? note.content
                  : `${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}`}
              </p>
            </div>
            
            {note.content.length > 150 && (
              <button
                onClick={() => toggleExpand(note.id)}
                className="text-sm text-blue-500 hover:underline"
              >
                {expandedNoteId === note.id ? 'Show less' : 'Show more'}
              </button>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              Created: {new Date(note.created_at).toLocaleString()}
              {note.updated_at && ` (Updated: ${new Date(note.updated_at).toLocaleString()})`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
