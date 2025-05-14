# Note Generator App

A full-stack application that generates explanatory notes on any topic using AI. Built with Next.js for the frontend and Python Flask for the backend.

## Features

- Enter a keyword to generate a 200-word explanation using ChatGPT
- Edit generated content before saving
- Save notes for future reference
- View, edit, and delete saved notes

## Project Structure

```
note-generator/
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # React components
│   └── ...
└── backend/             # Python Flask backend
    ├── app.py           # Main Flask application
    ├── requirements.txt # Python dependencies
    └── .env             # Environment variables
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up your OpenAI API key:
   - Edit the `.env` file and replace `your_openai_api_key_here` with your actual OpenAI API key

5. Run the Flask server:
   ```
   python app.py
   ```
   The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Run the Next.js development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Usage

1. Open your browser and go to http://localhost:3000
2. Enter a keyword or topic in the input field
3. Click "Generate Note" to create a note using AI
4. Edit the generated content if needed
5. Click "Save Note" to save it
6. View your saved notes in the list below
7. Use the "Edit" and "Delete" buttons to manage your notes

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, OpenAI API
- **Communication**: RESTful API
