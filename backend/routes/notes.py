from flask import Blueprint, request, jsonify
from models.note import (
    get_all_notes,
    create_new_note,
    update_existing_note,
    delete_note_by_id
)

# Create a Blueprint for notes routes
notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/notes', methods=['GET'])
def get_notes():
    """API endpoint to get all notes"""
    return jsonify(get_all_notes())

@notes_bp.route('/notes', methods=['POST'])
def create_note():
    """API endpoint to create a new note"""
    data = request.json
    keyword = data.get('keyword')
    content = data.get('content')
    
    if not keyword or not content:
        return jsonify({"error": "Keyword and content are required"}), 400
    
    new_note = create_new_note(keyword, content,"1")
    return jsonify(new_note), 201

@notes_bp.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """API endpoint to update an existing note"""
    data = request.json
    content = data.get('content')
    
    if not content:
        return jsonify({"error": "Content is required"}), 400
    
    updated_note = update_existing_note(note_id,"1", content)
    
    if updated_note:
        return jsonify(updated_note)
    
    return jsonify({"error": "Note not found"}), 404

@notes_bp.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """API endpoint to delete a note"""
    success = delete_note_by_id(note_id)
    
    if success:
        return jsonify({"message": "Note deleted successfully"})
    
    return jsonify({"error": "Note not found"}), 404
