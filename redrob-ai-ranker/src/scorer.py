import re
from typing import Iterable


def score_candidates(candidates: Iterable[dict], job_description: str) -> list[dict]:
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
