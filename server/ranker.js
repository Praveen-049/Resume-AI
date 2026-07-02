import OpenAI from 'openai';
import 'dotenv/config';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function rankCandidate({ job, jobSignals, candidate }) {
  if (openai) {
    try {
      return await rankWithOpenAI({ job, jobSignals, candidate });
    } catch (error) {
      console.warn('OpenAI ranking failed, using local fallback:', error.message);
    }
  }

  return rankLocally({ jobSignals, candidate });
}

async function rankWithOpenAI({ job, jobSignals, candidate }) {
  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are ResumeAI, an expert HR-tech ranking engine. Return strict JSON with numeric scores from 0-100 and concise recruiting reasoning.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          task: 'Rank this candidate for the job.',
          schema: {
            semanticScore: 'number',
            technicalScore: 'number',
            behaviorScore: 'number',
            cultureScore: 'number',
            stabilityScore: 'number',
            totalScore: 'number',
            recommendation: 'Interview | Shortlist | Hold | Reject',
            reasons: ['string'],
            strengths: ['string'],
            weaknesses: ['string'],
            confidence: 'number',
          },
          job: {
            title: job.title,
            description: job.description.slice(0, 5000),
            extractedSignals: jobSignals,
          },
          candidate: {
            profile: candidate.parsed,
            resumeText: candidate.raw_text.slice(0, 7000),
          },
        }),
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0].message.content || '{}');
  return normalizeRanking(parsed, 'openai');
}

export function rankLocally({ jobSignals, candidate }) {
  const parsed = candidate.parsed || {};
  const candidateSkills = parsed.skills || [];
  const requiredSkills = jobSignals.skills || [];
  const overlap = requiredSkills.filter((skill) =>
    candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase()),
  );
  const skillRatio = requiredSkills.length ? overlap.length / requiredSkills.length : 0.55;
  const years = Number(parsed.years || 0);
  const seniorityFit = jobSignals.minimumYears ? Math.min(years / jobSignals.minimumYears, 1) : Math.min(years / 7, 1);
  const semanticScore = clamp(58 + skillRatio * 34 + seniorityFit * 8);
  const technicalScore = clamp(52 + skillRatio * 42 + Math.min(candidateSkills.length, 8));
  const behaviorScore = clamp(72 + Math.min(years, 10) * 1.8 + overlap.length * 1.5);
  const cultureScore = clamp(76 + (parsed.summary ? 7 : 0) + Math.min(candidateSkills.length, 8));
  const stabilityScore = clamp(70 + Math.min(years, 10) * 2.1);
  const totalScore = clamp(
    semanticScore * 0.32 + technicalScore * 0.28 + behaviorScore * 0.16 + cultureScore * 0.12 + stabilityScore * 0.12,
  );

  return normalizeRanking(
    {
      semanticScore,
      technicalScore,
      behaviorScore,
      cultureScore,
      stabilityScore,
      totalScore,
      recommendation: totalScore >= 88 ? 'Interview' : totalScore >= 78 ? 'Shortlist' : totalScore >= 65 ? 'Hold' : 'Reject',
      reasons: [
        overlap.length ? `Matched ${overlap.join(', ')} from the job requirements.` : 'Limited direct skill overlap found.',
        `${years || 'Unknown'} years of experience inferred from resume content.`,
        'Local scoring used because no AI provider response was available.',
      ],
      strengths: overlap.length ? overlap : candidateSkills.slice(0, 3),
      weaknesses: requiredSkills.filter((skill) => !overlap.includes(skill)).slice(0, 3),
      confidence: openai ? 72 : 64,
    },
    openai ? 'fallback' : 'local',
  );
}

function normalizeRanking(ranking, provider) {
  const totalScore = clamp(Number(ranking.totalScore ?? 0));
  return {
    semanticScore: clamp(Number(ranking.semanticScore ?? totalScore)),
    technicalScore: clamp(Number(ranking.technicalScore ?? totalScore)),
    behaviorScore: clamp(Number(ranking.behaviorScore ?? 75)),
    cultureScore: clamp(Number(ranking.cultureScore ?? 75)),
    stabilityScore: clamp(Number(ranking.stabilityScore ?? 75)),
    totalScore,
    recommendation: ranking.recommendation || (totalScore >= 80 ? 'Shortlist' : 'Hold'),
    reasoning: {
      reasons: arrayish(ranking.reasons),
      strengths: arrayish(ranking.strengths),
      weaknesses: arrayish(ranking.weaknesses),
      confidence: clamp(Number(ranking.confidence ?? 70)),
    },
    provider,
  };
}

function arrayish(value) {
  return Array.isArray(value) ? value.slice(0, 5) : [];
}

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value.toFixed?.(1) ?? value)));
}
