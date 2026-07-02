import os
import json
from io import BytesIO
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path

from .database import engine, Base, get_db
from .models import User, JobDescription, RankingResult
from .schemas import UserRegister, UserLogin, Token, UserOut
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from .ranking_service import generate_ranking

try:
    from docx import Document
except ImportError:
    Document = None

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/api/job-description/upload")
def upload_job_description(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files allowed")
    
    if Document is None:
        raise HTTPException(status_code=500, detail="python-docx not installed")
    
    try:
        doc = Document(BytesIO(file.file.read()))
        content = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
    
    file_path = UPLOAD_DIR / f"jd_{current_user.id}_{file.filename}"
    with open(file_path, "w") as f:
        f.write(content)
    
    jd = JobDescription(
        user_id=current_user.id,
        filename=file.filename,
        content=content,
        file_path=str(file_path),
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    
    return {
        "id": jd.id,
        "filename": jd.filename,
        "content_preview": content[:200] + "..." if len(content) > 200 else content,
    }


@app.post("/api/ranking/evaluate")
def evaluate_resumes(
    jd_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files allowed")
    
    jd = db.query(JobDescription).filter(
        JobDescription.id == jd_id,
        JobDescription.user_id == current_user.id,
    ).first()
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    try:
        candidates = json.load(file.file)
        if isinstance(candidates, dict):
            candidates = [candidates]
        elif not isinstance(candidates, list):
            raise ValueError("JSON must be a list or object")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")
    
    results_json = generate_ranking(candidates, jd.content)
    
    ranking = RankingResult(
        user_id=current_user.id,
        job_description_id=jd_id,
        results=results_json,
    )
    db.add(ranking)
    db.commit()
    db.refresh(ranking)
    
    return {
        "id": ranking.id,
        "results": json.loads(results_json),
    }


@app.get("/api/ranking/results/{ranking_id}")
def get_ranking_result(
    ranking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ranking = db.query(RankingResult).filter(
        RankingResult.id == ranking_id,
        RankingResult.user_id == current_user.id,
    ).first()
    if not ranking:
        raise HTTPException(status_code=404, detail="Ranking not found")
    
    return {
        "id": ranking.id,
        "results": json.loads(ranking.results),
        "created_at": ranking.created_at,
    }


@app.get("/api/ranking/history")
def get_user_rankings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rankings = db.query(RankingResult).filter(RankingResult.user_id == current_user.id).all()
    return [
        {
            "id": r.id,
            "created_at": r.created_at,
            "job_description_id": r.job_description_id,
        }
        for r in rankings
    ]
