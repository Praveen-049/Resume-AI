from pathlib import Path

try:
    from docx import Document
except ImportError:  # pragma: no cover - optional dependency
    Document = None


def parse_job_description(path: str | Path) -> str:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Job description file not found: {path}")

    if path.suffix.lower() == ".docx":
        if Document is not None:
            try:
                doc = Document(path)
                text = "\n".join(paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip())
                if text:
                    return text
            except Exception:
                pass

        try:
            return path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return path.read_text(encoding="utf-16", errors="ignore")

    return path.read_text(encoding="utf-8", errors="ignore")
