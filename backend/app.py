from flask import Flask
from flask_cors import CORS
import os

# Import routes
from routes.notes import notes_bp
from routes.generate import generate_bp
from config import DEBUG, PORT, API_PREFIX

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Register blueprints
    app.register_blueprint(notes_bp, url_prefix=API_PREFIX)
    app.register_blueprint(generate_bp, url_prefix=API_PREFIX)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=DEBUG, port=PORT)
