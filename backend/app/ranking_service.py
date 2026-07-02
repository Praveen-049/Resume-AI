import json
import re
from typing import List


def score_candidates(candidates: List[dict], job_description: str) -> List[dict]:
    """Score candidates based on job description keywords."""
    keywords = [word.lower() for word in re.findall(r"[a-zA-Z0-9]+", job_description)]
    unique_keywords = set(keywords)

    scored = []
    for candidate in candidates:
        text = " ".join(str(candidate.get(field, "")) for field in ("name", "summary", "skills", "experience"))
        text_lower = text.lower()
        score = sum(1 for keyword in unique_keywords if keyword in text_lower)
        scored.append({
            "candidate": candidate,
            "score": score,
        })

    return sorted(scored, key=lambda item: item["score"], reverse=True)


def generate_ranking(candidates: List[dict], job_description: str) -> str:
    """Generate ranking results as JSON."""
    scored = score_candidates(candidates, job_description)
    
    results = []
    for rank, entry in enumerate(scored, 1):
        candidate = entry["candidate"]
        results.append({
            "rank": rank,
            "name": candidate.get("name", "Unknown"),
            "score": entry["score"],
            "skills": candidate.get("skills", []),
            "summary": candidate.get("summary", ""),
        })
    
    return json.dumps(results, indent=2)
