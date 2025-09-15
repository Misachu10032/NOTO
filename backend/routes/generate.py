from flask import Blueprint, request, jsonify
import openai
import logging
from config import OPENAI_API_KEY, OPENAI_MODEL

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a Blueprint for generation routes
generate_bp = Blueprint("generate", __name__)

# Load OpenAI API key from environment variable
openai.api_key = OPENAI_API_KEY


@generate_bp.route("/generate", methods=["POST"])
def generate_note():
    """API endpoint to generate note content using OpenAI"""
    logger.info("Received request to /api/generate")

    data = request.json
    logger.info(f"Request data: {data}")

    if not data:
        logger.error("No JSON data received in request")
        return jsonify({"error": "No data provided"}), 400

    keyword = data.get("keyword")
    logger.info(f"Extracted keyword: {keyword}")

    if not keyword:
        logger.error("No keyword provided in request")
        return jsonify({"error": "Keyword is required"}), 400

    try:
        logger.info("aaaaaaaaaCalling OpenAI API...")
        logger.info("API Key:")
        logger.info(f"API Key: {openai.api_key}")
        # Using OpenAI's API to generate content
        response = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that provides study notes "
                        "and examples for students. Always format your response "
                        "in **valid Markdown**, using headings, bullet points, "
                        "and code blocks where appropriate."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Generate detailed study notes for: {keyword}",
                },
            ],
        )

        logger.info("Successfully received response from OpenAI")
        content = response.choices[0].message.content

        return jsonify({"keyword": keyword, "content": content})
    except Exception as e:
        logger.error(f"Error in generate_note: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@generate_bp.route("/ask-followup", methods=["POST"])
def ask_followup():
    """API endpoint to handle follow-up Q&A for a note"""
    data = request.json
    logger.info(f"Follow-up API called with: {data}")

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract fields
    keyword = data.get("keyword")
    note_content = data.get("content")
    followup_questions = data.get("followupQuestions", [])
    followup_answers = data.get("followupAnswers", [])
    new_question = data.get("question")

    if not note_content or not new_question:
        return jsonify({"error": "Missing note content or question"}), 400

    # Build conversation history for OpenAI
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that answers follow-up questions about study notes.Always format your response "
                        "in **valid Markdown**, using headings, bullet points, "
                        "and code blocks where appropriate.",
        },
        {
            "role": "user",
            "content": f"The original note was created for the topic: {keyword}\n\nHere is the full note content:\n{note_content}",
        },
    ]

    # Add previous Q&A pairs as context
    for q, a in zip(followup_questions, followup_answers):
        messages.append({"role": "user", "content": f"Previous question: {q}"})
        messages.append({"role": "assistant", "content": f"{a}"})

    # Add the new question
    messages.append({"role": "user", "content": f"New question: {new_question}"})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4", messages=messages  # or your chosen model
        )

        answer = response.choices[0].message.content

        return jsonify({"question": new_question, "answer": answer})

    except Exception as e:
        logger.error(f"Error in ask_followup: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
