import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: number;
  keyword: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface TempNote {
  id: string | number;
  keyword: string;
  content: string;
}

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  isEditorVisible: boolean;
  isFollowUpMode: boolean;
  tempNote: TempNote;
}

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,
  isEditorVisible: false,
  isFollowUpMode: false,
  tempNote: { id: '', keyword: '', content: '' },
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
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
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      if (state.selectedNote?.id === action.payload.id) {
        state.selectedNote = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
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
    setTempNote: (state, action: PayloadAction<TempNote>) => {
      state.tempNote = action.payload;
    },
    updateTempNoteContent: (state, action: PayloadAction<string>) => {
      state.tempNote.content = action.payload;
    },
  },
});

export const {
  setNotes,
  setSelectedNote,
  setLoading,
  setError,
  addNote,
  updateNote,
  deleteNote,
  setEditorVisible,
  setFollowUpMode,
  setTempNote,
  updateTempNoteContent,
} = notesSlice.actions;

export default notesSlice.reducer;
