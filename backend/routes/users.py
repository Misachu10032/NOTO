from flask import Blueprint, request, jsonify
from models.user import create_or_update_user, get_all_users

users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["POST"])
def register_user():
    print("--________________reguist-____________")
    """
    Create or update a user record when they log in via Google.
    Expected JSON:
    {
        "email": "user@example.com",
        "name": "John Doe"
    }
    """
    data = request.json
    email = data.get("email")
    name = data.get("name")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = create_or_update_user(email, name)
    return jsonify(user), 201


@users_bp.route("/users", methods=["GET"])
def list_users():
    """Optional: For debugging — list all users in the database."""
    users = get_all_users()
    return jsonify(users), 200
