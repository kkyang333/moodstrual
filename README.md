# Health Tracker + Chatbot

A personal health tracker and friendly chatbot that lets users log daily mood, period status, and symptoms. Visualize your cycle and mood on a calendar and get encouragement from a cute virtual pet.

## Features

- Log daily mood, period status, symptoms, and notes.
- Calendar view showing period days and moods.
- Chatbot gives empathetic advice based on your recent logs.
- Virtual pet gives encouragement with cute animations and confetti.

## Tech Stack

- **Frontend:** React, MUI, TailwindCSS, Vite
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Chatbot:** Google Gemini API

## Setup

### Backend

1. Install dependencies:
```bash
pip install -r backend/requirements.txt
```
2. Set your Gemini API key in .env:
```
GEMINI_API_KEY=your_api_key_here
```
3. Run the backend:
```
uvicorn main:app --reload
```
### Frontend

1. Install dependencies:

```
cd frontend
npm install
```

2. Run the frontend:
```
npm run dev
```
### Usage

Access the frontend at http://localhost:5173.

Log your day and see updates in the calendar.

Click the pet for encouragement and confetti!

### License
MIT
