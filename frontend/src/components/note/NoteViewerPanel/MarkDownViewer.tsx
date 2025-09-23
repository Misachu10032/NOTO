'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // Or another theme

interface Props {
  content: string;
  tags: string[]; // ✅ New: optional array of tags
}

export default function MarkdownViewer({ content, tags  }: Props) {
  return (
    <div className="prose max-w-none prose-slate dark:prose-invert overflow-y-auto max-h-[70vh] p-4 rounded-md border border-gray-200 bg-white">
      
      {/* ✅ Show tags if available */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ✅ Render markdown */}
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
