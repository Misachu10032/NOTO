"use client";

import { useState } from "react";
import TitleInput from "./TitleInput";
import TagManager from "./TagManager";
import ContentEditor from "./ContentEditor";

interface NoteEditorProps {
  content: string;
  keyword: string;
  tags: string[] | undefined;
  onSave: (data: { keyword: string; content: string; tags: string[] }) => void;
  isSaving: boolean;
}

export default function NoteEditor({
  content: initialContent,
  keyword: initialKeyword,
  tags: initialTags = [],
  onSave,
  isSaving,
}: NoteEditorProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);

  return (
    <div className="h-full flex flex-col space-y-4">
      <TitleInput value={keyword} onChange={setKeyword} disabled={isSaving} />
      <TagManager tags={tags} onChange={setTags} disabled={isSaving} />
      <ContentEditor value={content} onChange={setContent} disabled={isSaving} />

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave({ keyword, content, tags })}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
