import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
  id: number;
  keyword: string;
  content: string;
  created_at: string;
  updated_at?: string;
  saved?: boolean;
  tags: string[];
}

export interface TempNote {
  id: string | number;
  keyword: string;
  content: string;
  followupQuestions: string[];
  followupAnswers: string[];
  tags: string[];
}

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  isEditorVisible: boolean;
  isFollowUpMode: boolean;
  tempNotes: TempNote[];
  allTags: string[];
  selectedTags: string[];
  filterMode: "AND" | "OR";
}
interface SyncNotePayload {
  oldId: number
  savedNote: Note,
}

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,
  isEditorVisible: false,
  isFollowUpMode: false,
  tempNotes: [], // New tempNotes should include followupQuestions/Answers when created
  allTags: [],
  selectedTags: [],
  filterMode: "OR",

};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload.map(note => ({
        ...note,
        saved: true, // ✅ force saved to be true
      }));
      state.isLoading = false;
      state.error = null;
      console.log("sadsadasdaszzzzzzzzzzzzz", state.notes);
      const tags = new Set<string>();
      action.payload.forEach((note) => {
        note.tags?.forEach((tag) => tags.add(tag));
      });
      state.allTags = Array.from(tags);

    },
    setSelectedNote: (state, action: PayloadAction<Note>) => {
      const note = action.payload;
      state.selectedNote = note;

      // Only add to tempNotes if not already present
      const exists = state.tempNotes.some(
        (t) => String(t.id) === String(note.id)
      );
      if (!exists) {
        state.tempNotes.push({
          ...note,
          followupQuestions: [],
          followupAnswers: [],
        });
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      if (state.selectedNote?.id === action.payload.id) {
        state.selectedNote = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      if (state.selectedNote?.id === action.payload) {
        state.selectedNote = null;
      }
    },
    setEditorVisible: (state, action: PayloadAction<boolean>) => {
      state.isEditorVisible = action.payload;
    },
    setFollowUpMode: (state, action: PayloadAction<boolean>) => {
      state.isFollowUpMode = action.payload;
    },
    setTempNotes: (state, action: PayloadAction<TempNote[]>) => {
      state.tempNotes = action.payload;
    },

    addTempNote: (state, action: PayloadAction<TempNote>) => {
      state.tempNotes.push(action.payload);
    },
    updateTempNoteContent: (
      state,
      action: PayloadAction<{ id: string | number; content: string }>
    ) => {
      const note = state.tempNotes.find((n) => n.id === action.payload.id);
      if (note) note.content = action.payload.content;
    },
    addTempNoteFollowUpQuestion: (
      state,
      action: PayloadAction<{ id: string | number; followupQuestion: string }>
    ) => {
      const note = state.tempNotes.find((n) => n.id === action.payload.id);
      if (note) {
        note.followupQuestions.push(action.payload.followupQuestion);
      }
    },
    addTempNoteFollowUpAnswer: (
      state,
      action: PayloadAction<{ id: string | number; followupAnswer: string }>
    ) => {
      const note = state.tempNotes.find((n) => n.id === action.payload.id);
      if (note) {
        note.followupAnswers.push(action.payload.followupAnswer);
      }
    },
    removeTempNote: (state, action: PayloadAction<string | number>) => {
      state.tempNotes = state.tempNotes.filter((n) => n.id !== action.payload);
    },

    syncNoteAfterSave: (state, action: PayloadAction<SyncNotePayload>) => {
      const { oldId, savedNote } = action.payload;


      state.selectedNote = {
        ...state.selectedNote,
        ...savedNote,
        saved: true,
      };


      // ✅ Update notes array
      state.notes = state.notes.map((note) =>
        note.id === oldId ? { ...note, ...savedNote, saved: true } : note
      );

      // ✅ Update tempNotes array
      state.tempNotes = state.tempNotes.map((note) =>
        note.id === oldId ? { ...note, ...savedNote, saved: true } : note
      );
      const tags = new Set<string>();
      state.notes.forEach((note) => {
        note.tags?.forEach((tag) => tags.add(tag));
      });
      state.allTags = Array.from(tags);
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    setFilterMode(state, action: PayloadAction<"AND" | "OR">) {
      state.filterMode = action.payload;
    },
  },
});

export const {
  setFilterMode,
  setNotes,
  setSelectedNote,
  setSelectedTags,
  setLoading,
  setError,
  addNote,
  updateNote,
  deleteNote,
  setEditorVisible,
  setFollowUpMode,
  setTempNotes,
  addTempNote,
  updateTempNoteContent,
  removeTempNote,
  addTempNoteFollowUpQuestion,
  addTempNoteFollowUpAnswer,
  syncNoteAfterSave
} = notesSlice.actions;

export default notesSlice.reducer;
