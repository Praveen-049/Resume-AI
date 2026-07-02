def generate_reasoning(candidate: dict, job_description: str) -> str:
    name = candidate.get("name", "Candidate")
    skills = candidate.get("skills", "")
    summary = candidate.get("summary", "")
    return (
        f"{name} appears relevant because their skills and experience align with the requested role. "
        f"Skills: {skills}. Summary: {summary}."
    )
