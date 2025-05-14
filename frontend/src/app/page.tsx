'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setNotes, setLoading, setError, addNote, updateNote, setSelectedNote } from './store/slices/notesSlice';
import NoteForm from '@/components/NoteForm';
import NoteEditor from '@/components/NoteEditor';
import NoteSummary from '@/components/NoteSummary';
import MarkdownViewer from '@/components/MarkdownViewer';

export default function Home() {
  const dispatch = useAppDispatch();
  const { notes, selectedNote, isLoading } = useAppSelector((state) => state.notes);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      dispatch(setNotes(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      dispatch(setError(errorMessage));
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleNoteGenerated = async (keyword: string, content: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      const newNote = await response.json();
      dispatch(addNote(newNote));
      dispatch(setSelectedNote(newNote));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      dispatch(setError(errorMessage));
      console.error(err);
    }
  };

  const handleSaveNote = async (content: string) => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedNote = await response.json();
      dispatch(updateNote(updatedNote));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      dispatch(setError(errorMessage));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Note Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Note Form and Summary */}
          <div className="lg:col-span-1 space-y-4">
            <NoteForm onNoteGenerated={handleNoteGenerated} />
            <NoteSummary />
          </div>
          
          {/* Right column - Note Editor/Viewer */}
          <div className="lg:col-span-2">
            {selectedNote ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Editor</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => dispatch(setSelectedNote(null))}
                        className="text-gray-500 hover:text-gray-700"
                        title="Close"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <NoteEditor 
                      content={selectedNote.content}
                      onContentChange={(content) => 
                        dispatch(updateNote({ ...selectedNote, content }))
                      }
                      isSaving={false}
                    />
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-4">Preview</h2>
                  <div className="flex-1 min-h-0 overflow-auto">
                    <MarkdownViewer content={selectedNote.content} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  {isLoading ? 'Loading...' : 'Select a note or generate a new one'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
