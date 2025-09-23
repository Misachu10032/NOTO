import { useState, useEffect, useMemo } from "react";
import { useNotes } from "@/app/hooks/useNotes";
import MarkdownViewer from "@/components/Note/NoteViewerPanel/MarkDownViewer";
import NoteEditorPanel from "./NoteEditorPanel";

export default function NoteViewerPanel() {
  const {
    selectedNote,
    tempNotes,
    isEditorVisible,
    setEditorVisible,
    addTempNoteFollowUpQuestion,
    addTempNoteFollowUpAnswer,
  } = useNotes();

  const [followUp, setFollowUp] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  // Find the temp note for the selected note
  const tempNote = useMemo(
    () => tempNotes.find((n) => n.id === selectedNote?.id) || null,
    [tempNotes, selectedNote]
  );

  if (!tempNote) {
    return <div className="p-4 text-gray-500">No note selected</div>;
  }

  const handleAskFollowUp = async () => {
    if (!tempNote.id || !followUp.trim()) return;

    setIsAsking(true);

    try {
      // Call your backend API
      const res = await fetch("http://localhost:5000/api/ask-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: tempNote.keyword, // ✅ Send original keyword
          content: tempNote.content, // ✅ Send full note content
          followupQuestions: tempNote.followupQuestions,
          followupAnswers: tempNote.followupAnswers,
          question: followUp,
        }),
      });

      const data = await res.json();
      console.log("did we get adata");

      if (res.ok) {
        // Update Redux state with new Q & A
        addTempNoteFollowUpQuestion({
          id: tempNote.id,
          followupQuestion: data.question,
        });
        addTempNoteFollowUpAnswer({
          id: tempNote.id,
          followupAnswer: data.answer,
        });

        // show answer on screen
      } else {
        console.error("Error from API:", data.error);
      }
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setIsAsking(false);
      setFollowUp("");
    }
  };


  useEffect(() => {
    console.log("isEditorVisible changed:", isEditorVisible);
  }, [isEditorVisible]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold break-words whitespace-normal">
            {tempNote.keyword}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEditorVisible(true)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              Edit
            </button>
      
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <MarkdownViewer content={tempNote.content} tags={tempNote.tags}/>
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

          {tempNote.followupQuestions?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-700">Follow-ups:</h3>
              <ul className="space-y-3">
                {tempNote.followupQuestions.map((q: string, idx: number) => (
                  <li
                    key={idx}
                    className="bg-gray-100 border border-gray-200 p-3 rounded-md text-sm"
                  >
                    {/* Display Question */}
                    <p className="mb-1">
                      <span className="font-medium text-gray-800">Q:</span> {q}
                    </p>

                    {/* Display Answer with Markdown */}
                    {(tempNote.followupAnswers || [])[idx] && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-800">A:</span>
                        <MarkdownViewer
                          content={(tempNote.followupAnswers || [])[idx]}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isEditorVisible ? (
        <NoteEditorPanel {...tempNote} />
      ) : (
        <div className="p-4" />
      )}
    </div>
  );
}
