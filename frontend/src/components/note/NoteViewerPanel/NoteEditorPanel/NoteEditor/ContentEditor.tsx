"use client";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ContentEditor({ value, onChange, disabled }: ContentEditorProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium text-gray-700 mb-1">Content</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full min-h-[200px] p-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        placeholder="Write your note here..."
        disabled={disabled}
      />
    </div>
  );
}
