# Resume AI Ranker

A full-stack web application for ranking candidates based on job descriptions using AI-powered matching.

## Features

- 🔐 User authentication (Register/Login)
- 📄 Job description upload (.docx files)
- 👥 Resume/candidate upload (.json files)
- 🤖 AI-powered ranking based on keyword matching
- 📊 Visual results dashboard
- 🎨 Modern React UI with Tailwind CSS

## Project Structure

```
Resume-AI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT authentication
│   │   ├── database.py          # Database setup
│   │   └── ranking_service.py   # Ranking logic
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx     # Auth state management
│   │   ├── components/ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Public landing page
│   │   │   ├── AuthPage.jsx            # Login/Register
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── JobDescriptionPage.jsx
│   │   │   ├── ResumeUploadPage.jsx
│   │   │   └── ResultsPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── .env
│
├── redrob-ai-ranker/            # Standalone ranking module
│   ├── src/
│   │   ├── parser.py
│   │   ├── jd_parser.py
│   │   ├── scorer.py
│   │   ├── ranker.py
│   │   ├── reasoning.py
│   │   └── submission.py
│   ├── data/
│   ├── output/
│   ├── main.py
│   └── requirements.txt
│
└── docker-compose.yml
```

## Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Development (Local)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Docker Compose

```bash
docker-compose up --build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Job Description
- `POST /api/job-description/upload` - Upload .docx job description

### Ranking
- `POST /api/ranking/evaluate` - Upload resumes and evaluate
- `GET /api/ranking/results/{ranking_id}` - Get ranking results
- `GET /api/ranking/history` - Get user's ranking history

## JSON Resume Format

```json
[
  {
    "name": "John Doe",
    "summary": "Software engineer with 5 years experience",
    "skills": ["Python", "React", "AWS"],
    "experience": "5 years"
  }
]
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./resume_ai.db
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Technology Stack

**Backend:**
- FastAPI
- SQLAlchemy
- JWT Authentication
- SQLite
- python-docx

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Vite

## License

MIT
