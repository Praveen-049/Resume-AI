import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const jwtSecret = process.env.JWT_SECRET || 'resumeai-dev-secret-change-me';

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });
}

export function sanitizeUser(user) {
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid session' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid session' });
  }
}

export function createUser({ name, email, password }) {
  const hash = bcrypt.hashSync(password, 12);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name.trim(), email.trim().toLowerCase(), hash);
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(result.lastInsertRowid);
}

export function verifyUser({ email, password }) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return null;
  return sanitizeUser(user);
}
