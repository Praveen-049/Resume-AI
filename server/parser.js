import fs from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

const skillCatalog = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'RAG',
  'FAISS',
  'Pinecone',
  'Embeddings',
  'LangChain',
  'LLM',
  'SQL',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'NLP',
  'Vector DB',
  'Evaluation',
];

export async function parseResume(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const buffer = await fs.readFile(file.path);
  let rawText = '';

  if (ext === '.pdf') {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    rawText = parsed.text || '';
    await parser.destroy();
  } else if (ext === '.docx') {
    const parsed = await mammoth.extractRawText({ buffer });
    rawText = parsed.value || '';
  } else {
    rawText = buffer.toString('utf8');
  }

  const cleanText = rawText.replace(/\s+/g, ' ').trim();
  const parsed = extractProfile(cleanText, file.originalname);

  return {
    rawText: cleanText,
    parsed,
  };
}

export function extractJobSignals(description) {
  const text = description.replace(/\s+/g, ' ').trim();
  const skills = extractSkills(text);
  const seniority = /staff|principal|lead/i.test(text)
    ? 'Lead'
    : /senior|sr\./i.test(text)
      ? 'Senior'
      : /junior|associate/i.test(text)
        ? 'Junior'
        : 'Mid';
  const years = Number(text.match(/(\d+)\+?\s*(years|yrs)/i)?.[1] || 0);

  return {
    skills,
    seniority,
    minimumYears: years,
    responsibilities: sentencePick(text, ['build', 'lead', 'design', 'own', 'collaborate', 'ship']),
  };
}

function extractProfile(text, fileName) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const firstLine = text.split(/[.\n]/).find(Boolean) || '';
  const fileBase = path.basename(fileName, path.extname(fileName)).replace(/[_-]+/g, ' ');
  const name = titleCase((firstLine.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/)?.[1] || fileBase).slice(0, 60));
  const years = Number(text.match(/(\d+)\+?\s*(years|yrs)/i)?.[1] || Math.max(2, Math.min(9, Math.floor(text.length / 900))));
  const company = text.match(/(?:at|@)\s+([A-Z][A-Za-z0-9 &.-]{2,40})/)?.[1] || 'Recent Company';

  return {
    name,
    email,
    currentCompany: company,
    years,
    skills: extractSkills(text),
    summary: sentencePick(text, ['engineer', 'developer', 'architect', 'scientist', 'manager']).join(' '),
  };
}

function extractSkills(text) {
  return skillCatalog.filter((skill) => new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i').test(text)).slice(0, 8);
}

function sentencePick(text, needles) {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => needles.some((needle) => sentence.toLowerCase().includes(needle)))
    .slice(0, 4);
}

function titleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
