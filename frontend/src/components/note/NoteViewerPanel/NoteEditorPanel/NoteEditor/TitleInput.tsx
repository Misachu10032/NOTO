"use client";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TitleInput({ value, onChange, disabled }: TitleInputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter keyword"
        disabled={disabled}
      />
    </div>
  );
}
