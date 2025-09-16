from flask import Blueprint, request, jsonify
from models.note import (
    get_notes_by_user,
    create_new_note,
    update_existing_note,
    delete_note_by_id
)

# Create a Blueprint for notes routes
notes_bp = Blueprint("notes", __name__)

# ----------------------------
# GET /notes?userId=...
# ----------------------------
@notes_bp.route("/notes", methods=["GET"])
def get_notes():
    """API endpoint to get notes for a specific user"""
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    notes = get_notes_by_user(user_id)
    return jsonify(notes), 200


# ----------------------------
# POST /notes
# ----------------------------
@notes_bp.route("/notes", methods=["POST"])
def create_note():
    """API endpoint to create a new note"""
    data = request.json
    keyword = data.get("keyword")
    content = data.get("content")
    user_id = data.get("userId")  # <-- must come from frontend

    if not keyword or not content or not user_id:
        return jsonify({"error": "Keyword, content, and userId are required"}), 400

    new_note = create_new_note(keyword, content, user_id)
    return jsonify(new_note), 201


# ----------------------------
# PUT /notes/<note_id>
# ----------------------------
@notes_bp.route("/notes/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    """API endpoint to update an existing note"""
    data = request.json
    content = data.get("content")
    user_id = data.get("userId")  # <-- must come from frontend

    if not content or not user_id:
        return jsonify({"error": "Content and userId are required"}), 400

    updated_note = update_existing_note(note_id, user_id, content)
    if updated_note:
        return jsonify(updated_note)

    return jsonify({"error": "Note not found"}), 404


# ----------------------------
# DELETE /notes/<note_id>
# ----------------------------
@notes_bp.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    """API endpoint to delete a note"""
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    success = delete_note_by_id(note_id, user_id)
    if success:
        return jsonify({"message": "Note deleted successfully"})

    return jsonify({"error": "Note not found"}), 404
