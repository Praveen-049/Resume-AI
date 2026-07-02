from fastapi import FastAPI

app = FastAPI(title="Candidate Ranking AI API")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Candidate Ranking AI backend is running"}
