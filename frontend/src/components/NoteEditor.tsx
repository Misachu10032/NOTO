'use client';

interface NoteEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void; // 👈 new prop
  isSaving: boolean;
}

export default function NoteEditor({
  content,
  onContentChange,
  onSave,
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
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
