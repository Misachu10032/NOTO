import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setNotes,
  setLoading,
  setError,
  addNote,
  updateNote,
  setSelectedNote,
  setEditorVisible,
  setFollowUpMode,
  setTempNotes,
  updateTempNoteContent,
  addTempNoteFollowUpQuestion,
  addTempNoteFollowUpAnswer,
  TempNote,
} from "../store/slices/notesSlice";

export function useNotes() {
  const dispatch = useAppDispatch();
  const {
    notes,
    selectedNote,
    isLoading,
    isEditorVisible,
    isFollowUpMode,
    tempNotes,
  } = useAppSelector((state) => state.notes);

  const tempNote =
    tempNotes.length > 0 ? tempNotes[0] : { id: "", keyword: "", content: "" };

  // Fetch notes on mount

  const fetchNotes = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      dispatch(setNotes(data));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch(setError(errorMessage));
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleNoteGenerated = async (keyword: string, content: string) => {
    try {
      const newNote = {
        keyword,
        content,
        created_at: new Date().toISOString(), // assign current timestamp
      };
      dispatch(addNote(newNote));
      dispatch(setSelectedNote(newNote));
      dispatch(setEditorVisible(false));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch(setError(errorMessage));
      console.error(err);
    }
  };

  const handleSaveNote = async (content: string) => {
    if (!selectedNote) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) throw new Error("Failed to update note");
      const updatedNote = await response.json();
      dispatch(updateNote(updatedNote));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      dispatch(setError(errorMessage));
      console.error(err);
    }
  };

  // Reset editor visibility when a new note is selected

  return {
    notes,
    selectedNote,
    isLoading,
    isEditorVisible,
    isFollowUpMode,
    tempNotes,
    tempNote,
    fetchNotes,
    handleNoteGenerated,
    handleSaveNote,
    setTempNotes: (notes: TempNote[] | any) => dispatch(setTempNotes(notes)),
    setSelectedNote: (note: any) => dispatch(setSelectedNote(note)),
    setEditorVisible: (visible: boolean) => dispatch(setEditorVisible(visible)),
    updateTempNoteContent: (payload: any) =>
      dispatch(updateTempNoteContent(payload)),
    setFollowUpMode: (val: boolean) => dispatch(setFollowUpMode(val)),
    addTempNoteFollowUpQuestion: (payload: {
      id: string | number;
      followupQuestion: string;
    }) => dispatch(addTempNoteFollowUpQuestion(payload)),
    addTempNoteFollowUpAnswer: (payload: {
      id: string | number;
      followupAnswer: string;
    }) => dispatch(addTempNoteFollowUpAnswer(payload)),
  };
}
