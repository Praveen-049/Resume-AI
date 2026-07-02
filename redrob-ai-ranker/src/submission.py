import csv
from pathlib import Path


def write_submission(ranked_candidates: list[dict], output_path: str | Path) -> None:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["name", "score", "reasoning"])
        writer.writeheader()
        for entry in ranked_candidates:
            candidate = entry["candidate"]
            writer.writerow({
                "name": candidate.get("name", ""),
                "score": entry["score"],
                "reasoning": entry["reasoning"],
            })
