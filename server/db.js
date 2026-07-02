import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const dataDir = path.resolve('data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'resumeai.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    extracted_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    current_company TEXT,
    file_name TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    parsed_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS rankings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    semantic_score REAL NOT NULL,
    technical_score REAL NOT NULL,
    behavior_score REAL NOT NULL,
    culture_score REAL NOT NULL,
    stability_score REAL NOT NULL,
    total_score REAL NOT NULL,
    recommendation TEXT NOT NULL,
    reasoning_json TEXT NOT NULL DEFAULT '{}',
    provider TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
  );
`);

export function rowToJson(row, fields) {
  if (!row) return row;
  const copy = { ...row };
  fields.forEach((field) => {
    try {
      copy[field] = JSON.parse(copy[field] || '{}');
    } catch {
      copy[field] = {};
    }
  });
  return copy;
}
