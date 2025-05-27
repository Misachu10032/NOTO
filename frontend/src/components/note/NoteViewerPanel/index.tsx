import { useState, useEffect } from "react";
import { useNotes } from "@/app/hooks/useNotes";
import MarkdownViewer from "@/components/note/NoteViewerPanel/MarkDownViewer";
import NoteEditorPanel from "./NoteEditorPanel";

export default function NoteViewerPanel() {
  const {
    selectedNote,
    tempNote: rawTempNote,
    isEditorVisible,
    setEditorVisible,
    setFollowUpMode,
    isFollowUpMode,
    addTempNoteFollowUpQuestion,
    addTempNoteFollowUpAnswer,
  } = useNotes();

  // Always provide followupQuestions/Answers arrays for tempNote
  const tempNote = {
    ...rawTempNote,
    followupQuestions: Array.isArray((rawTempNote as any).followupQuestions)
      ? (rawTempNote as any).followupQuestions
      : [],
    followupAnswers: Array.isArray((rawTempNote as any).followupAnswers)
      ? (rawTempNote as any).followupAnswers
      : [],
  };
  const [followUp, setFollowUp] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);

  // Submit follow-up: dispatch Redux actions for Q & A
  const handleAskFollowUp = async () => {
    if (!tempNote?.id || !followUp.trim()) return;
    setIsAsking(true);
    setFollowUpAnswer(null);
    // Simulate async answer (replace with real backend call if needed)
    setTimeout(() => {
      const answer = "(Simulated answer from AI)";
      addTempNoteFollowUpQuestion({
        id: tempNote.id,
        followupQuestion: followUp,
      });
      addTempNoteFollowUpAnswer({ id: tempNote.id, followupAnswer: answer });
      setFollowUpAnswer(answer);
      setIsAsking(false);
      setFollowUp("");
    }, 1000);
  };

  const toggleFollowUpMode = () => setFollowUpMode(!isFollowUpMode);

  // Log when isEditorVisible changes
  useEffect(() => {
    console.log("isEditorVisible changed:", isEditorVisible);
  }, [isEditorVisible]);

  const handleEditButtonClick = () => {
    setEditorVisible(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold break-words whitespace-normal">
            {selectedNote?.keyword}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleEditButtonClick}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.793.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>

            <button
              onClick={toggleFollowUpMode}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                />
              </svg>
              Ask Follow-up
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <MarkdownViewer content={tempNote.content} />
        </div>

        {/* Follow-up Q&A section */}
        <div className="mt-6">
          <label className="block font-medium mb-2 text-gray-700">
            Ask a follow-up question:
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Type your question..."
              disabled={isAsking}
            />
            <button
              className={`px-4 py-2 rounded text-white transition-colors ${
                isAsking || !followUp.trim()
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleAskFollowUp}
              disabled={!followUp.trim() || isAsking}
            >
              Ask
            </button>
          </div>
          {isAsking && (
            <p className="text-sm text-gray-400 mt-2 animate-pulse">
              Thinking...
            </p>
          )}
          {followUpAnswer && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
              <strong className="text-green-700">Answer:</strong>{" "}
              {followUpAnswer}
            </div>
          )}

          {/* Display all previous Q&A if any */}
          {tempNote.followupQuestions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-700">
                Previous Follow-ups:
              </h3>
              <ul className="space-y-3">
                {tempNote.followupQuestions.map((q: string, idx: number) => (
                  <li
                    key={idx}
                    className="bg-gray-100 border border-gray-200 p-3 rounded-md text-sm"
                  >
                    <p className="mb-1">
                      <span className="font-medium text-gray-800">Q:</span> {q}
                    </p>
                    {(tempNote.followupAnswers || [])[idx] && (
                      <p>
                        <span className="font-medium text-gray-800">A:</span>{" "}
                        {(tempNote.followupAnswers || [])[idx]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isEditorVisible ? <NoteEditorPanel /> : <div className="p-4" />}
    </div>
  );
}
