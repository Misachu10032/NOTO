import json
import os
import datetime
from config import NOTES_FILE

# Initialize notes storage

def load_notes():
    """
    Load notes from the JSON file
    
    Returns:
        list: List of note objects
    """
    if os.path.exists(NOTES_FILE):
        with open(NOTES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_notes(notes):
    """
    Save notes to the JSON file
    
    Args:
        notes (list): List of note objects to save
    """
    with open(NOTES_FILE, 'w') as f:
        json.dump(notes, f, indent=2)

def get_all_notes():
    """
    Get all notes
    
    Returns:
        list: List of all notes
    """
    return load_notes()

def create_new_note(keyword, content):
    """
    Create a new note
    
    Args:
        keyword (str): The keyword/title of the note
        content (str): The content of the note
        
    Returns:
        dict: The newly created note
    """
    notes = load_notes()
    note_id = len(notes) + 1
    
    new_note = {
        "id": note_id,
        "keyword": keyword,
        "content": content,
        "created_at": str(datetime.datetime.now())
    }
    
    notes.append(new_note)
    save_notes(notes)
    
    return new_note

def update_existing_note(note_id, content):
    """
    Update an existing note
    
    Args:
        note_id (int): The ID of the note to update
        content (str): The new content for the note
        
    Returns:
        dict or None: The updated note or None if not found
    """
    notes = load_notes()
    
    for note in notes:
        if note["id"] == note_id:
            note["content"] = content
            note["updated_at"] = str(datetime.datetime.now())
            save_notes(notes)
            return note
    
    return None

def delete_note_by_id(note_id):
    """
    Delete a note by ID
    
    Args:
        note_id (int): The ID of the note to delete
        
    Returns:
        bool: True if note was deleted, False if not found
    """
    notes = load_notes()
    
    for i, note in enumerate(notes):
        if note["id"] == note_id:
            del notes[i]
            save_notes(notes)
            return True
    
    return False
