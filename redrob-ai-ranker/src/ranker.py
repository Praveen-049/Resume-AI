import csv
from pathlib import Path

from src.parser import load_candidates
from src.jd_parser import parse_job_description
from src.scorer import score_candidates
from src.reasoning import generate_reasoning
from src.submission import write_submission


def run_pipeline():
    base_dir = Path(__file__).resolve().parent.parent
    candidates_path = base_dir / "data" / "candidates.jsonl.gz"
    fallback_candidates_path = base_dir / "data" / "sample_candidates.jsonl"
    job_description_path = base_dir / "data" / "job_description.docx"
    output_path = base_dir / "output" / "team_name.csv"

    if candidates_path.exists() and candidates_path.stat().st_size > 0:
        selected_candidates_path = candidates_path
    elif fallback_candidates_path.exists():
        selected_candidates_path = fallback_candidates_path
    else:
        selected_candidates_path = candidates_path

    candidates = load_candidates(selected_candidates_path)
    job_description = parse_job_description(job_description_path)
    scored = score_candidates(candidates, job_description)

    ranked = []
    for entry in scored:
        ranked.append({
            "candidate": entry["candidate"],
            "score": entry["score"],
            "reasoning": generate_reasoning(entry["candidate"], job_description),
        })

    write_submission(ranked, output_path)
    print(f"Wrote {len(ranked)} ranked candidates to {output_path}")
