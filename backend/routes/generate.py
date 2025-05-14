from flask import Blueprint, request, jsonify
import openai
import logging
from config import OPENAI_API_KEY, OPENAI_MODEL

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a Blueprint for generation routes
generate_bp = Blueprint('generate', __name__)

# Load OpenAI API key from environment variable
openai.api_key = OPENAI_API_KEY

@generate_bp.route('/generate', methods=['POST'])
def generate_note():
    """API endpoint to generate note content using OpenAI"""
    logger.info("Received request to /api/generate")
    
    data = request.json
    logger.info(f"Request data: {data}")
    
    if not data:
        logger.error("No JSON data received in request")
        return jsonify({"error": "No data provided"}), 400
        
    keyword = data.get('keyword')
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
                {"role": "system", "content": "You are a helpful assistant that provides study notes and examples for students."},
                {"role": "user", "content": f" {keyword}"}
            ]
        )
        
        logger.info("Successfully received response from OpenAI")
        content = response.choices[0].message.content
        
        return jsonify({
            "keyword": keyword,
            "content": content
        })
    except Exception as e:
        logger.error(f"Error in generate_note: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
