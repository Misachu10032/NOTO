import { useState } from "react";

type FollowUpFormProps = {
  onSubmit: (question: string) => void;
  isAsking: boolean;
};

export default function FollowUpForm({ onSubmit, isAsking }: FollowUpFormProps) {
  const [question, setQuestion] = useState("");

  return (
    <div className="space-y-2">
      <input
        className="w-full border rounded px-2 py-1"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Type your follow-up question..."
        disabled={isAsking}
      />
      <button
        className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          onSubmit(question);
          setQuestion("");
        }}
        disabled={!question.trim() || isAsking}
      >
        Ask
      </button>
    </div>
  );
}
