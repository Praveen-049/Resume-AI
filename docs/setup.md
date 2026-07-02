# Setup

## Backend
- cd backend
- pip install -r requirements.txt
- uvicorn app.main:app --reload

## Frontend
- cd frontend
- npm install
- npm run dev

## Infrastructure
- docker compose -f docker/docker-compose.yml up -d
