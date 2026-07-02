import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { db, rowToJson } from './db.js';
import { createUser, requireAuth, sanitizeUser, signToken, verifyUser } from './auth.js';
import { extractJobSignals, parseResume } from './parser.js';
import { rankCandidate } from './ranker.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const uploadDir = path.resolve('uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 20,
  },
  fileFilter(_req, file, cb) {
    const allowed = ['.pdf', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(allowed.includes(ext) ? null : new Error('Only PDF, DOCX, TXT, and MD resumes are supported'), allowed.includes(ext));
  },
});

app.use(cors());
app.use(express.json({ limit: '2mb' }));

ensureDemoUser();

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    aiProvider: process.env.OPENAI_API_KEY ? 'openai' : 'local-fallback',
    database: 'sqlite',
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, email, and an 8+ character password are required' });
  }

  try {
    const user = createUser({ name, email, password });
    return res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    return res.status(500).json({ error: 'Could not create account' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const user = verifyUser(req.body);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  return res.json({ user, token: signToken(user) });
});

app.post('/api/auth/demo', (_req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get('demo@resumeai.local');
  res.json({ user, token: signToken(user) });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.get('/api/jobs', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
    .map((row) => rowToJson(row, ['extracted_json']));
  res.json({ jobs: rows });
});

app.post('/api/jobs', requireAuth, (req, res) => {
  const { title = 'Untitled Role', description } = req.body;
  if (!description || description.trim().length < 30) {
    return res.status(400).json({ error: 'A job description of at least 30 characters is required' });
  }

  const extracted = extractJobSignals(description);
  const result = db
    .prepare('INSERT INTO jobs (user_id, title, description, extracted_json) VALUES (?, ?, ?, ?)')
    .run(req.user.id, title.trim(), description.trim(), JSON.stringify(extracted));
  const job = rowToJson(db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid), ['extracted_json']);
  res.status(201).json({ job });
});

app.get('/api/candidates', requireAuth, (req, res) => {
  const candidates = db
    .prepare('SELECT * FROM candidates WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
    .map((row) => rowToJson(row, ['parsed_json']));
  res.json({ candidates });
});

app.post('/api/resumes/upload', requireAuth, upload.array('resumes', 20), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'Upload at least one resume file' });

  const saved = [];
  for (const file of req.files) {
    const parsedResume = await parseResume(file);
    const result = db
      .prepare(
        `INSERT INTO candidates
          (user_id, name, email, current_company, file_name, raw_text, parsed_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        req.user.id,
        parsedResume.parsed.name,
        parsedResume.parsed.email,
        parsedResume.parsed.currentCompany,
        file.originalname,
        parsedResume.rawText,
        JSON.stringify(parsedResume.parsed),
      );

    saved.push(
      rowToJson(db.prepare('SELECT * FROM candidates WHERE id = ?').get(result.lastInsertRowid), ['parsed_json']),
    );
  }

  res.status(201).json({ candidates: saved });
});

app.post('/api/rankings/run', requireAuth, async (req, res) => {
  const { jobId } = req.body;
  const jobRow = db.prepare('SELECT * FROM jobs WHERE id = ? AND user_id = ?').get(jobId, req.user.id);
  if (!jobRow) return res.status(404).json({ error: 'Job not found' });

  const job = rowToJson(jobRow, ['extracted_json']);
  const candidates = db
    .prepare('SELECT * FROM candidates WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
    .map((row) => rowToJson(row, ['parsed_json']))
    .map((candidate) => ({
      ...candidate,
      parsed: candidate.parsed_json,
    }));

  if (!candidates.length) return res.status(400).json({ error: 'Upload resumes before running ranking' });

  db.prepare('DELETE FROM rankings WHERE user_id = ? AND job_id = ?').run(req.user.id, job.id);

  const ranked = [];
  for (const candidate of candidates) {
    const ranking = await rankCandidate({
      job,
      jobSignals: job.extracted_json,
      candidate,
    });

    const result = db
      .prepare(
        `INSERT INTO rankings
          (user_id, job_id, candidate_id, semantic_score, technical_score, behavior_score, culture_score,
           stability_score, total_score, recommendation, reasoning_json, provider)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        req.user.id,
        job.id,
        candidate.id,
        ranking.semanticScore,
        ranking.technicalScore,
        ranking.behaviorScore,
        ranking.cultureScore,
        ranking.stabilityScore,
        ranking.totalScore,
        ranking.recommendation,
        JSON.stringify(ranking.reasoning),
        ranking.provider,
      );

    ranked.push({
      id: result.lastInsertRowid,
      candidate,
      ...ranking,
    });
  }

  ranked.sort((a, b) => b.totalScore - a.totalScore);
  res.json({ rankings: ranked, provider: ranked[0]?.provider || 'local' });
});

app.get('/api/rankings', requireAuth, (req, res) => {
  const jobId = Number(req.query.jobId);
  const rows = db
    .prepare(
      `SELECT rankings.*, candidates.name, candidates.current_company, candidates.file_name, candidates.parsed_json
       FROM rankings
       JOIN candidates ON candidates.id = rankings.candidate_id
       WHERE rankings.user_id = ? AND (? = 0 OR rankings.job_id = ?)
       ORDER BY rankings.total_score DESC`,
    )
    .all(req.user.id, jobId || 0, jobId || 0)
    .map((row) => {
      const parsed = rowToJson(row, ['reasoning_json', 'parsed_json']);
      return {
        ...parsed,
        candidate: {
          id: parsed.candidate_id,
          name: parsed.name,
          current_company: parsed.current_company,
          file_name: parsed.file_name,
          parsed_json: parsed.parsed_json,
        },
      };
    });

  res.json({ rankings: rows });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ error: error.message || 'Request failed' });
});

app.listen(port, () => {
  console.log(`ResumeAI API running on http://localhost:${port}`);
});

function ensureDemoUser() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@resumeai.local');
  if (existing) return;
  db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
    'Demo Recruiter',
    'demo@resumeai.local',
    bcrypt.hashSync('resumeai-demo', 12),
  );
}
