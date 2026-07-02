import { useMemo, useState } from 'react';
import './styles.css';

const candidates = [
  {
    id: 'CAN-1048',
    name: 'Ananya Raman',
    current: 'Senior ML Engineer',
    company: 'TalentGraph Labs',
    location: 'Bengaluru',
    score: 94,
    confidence: 'High',
    stage: 'Shortlist',
    experience: '6.5 yrs',
    lastActive: '2h ago',
    skills: ['LLM ranking', 'Python', 'FastAPI', 'Vector search', 'A/B testing'],
    signals: {
      roleFit: 96,
      trajectory: 91,
      behavior: 89,
      evidence: 94,
    },
    why:
      'Built semantic ranking systems, shipped recruiter-facing explainability, and shows strong ownership in platform activity.',
    risks: 'Limited enterprise ATS integration exposure.',
  },
  {
    id: 'CAN-2291',
    name: 'Rahul Mehta',
    current: 'Search Relevance Engineer',
    company: 'HireStack',
    location: 'Hyderabad',
    score: 89,
    confidence: 'High',
    stage: 'Interview',
    experience: '7 yrs',
    lastActive: '1d ago',
    skills: ['Embeddings', 'Learning to rank', 'Elasticsearch', 'Python', 'MLOps'],
    signals: {
      roleFit: 90,
      trajectory: 86,
      behavior: 83,
      evidence: 92,
    },
    why:
      'Strong hybrid retrieval background and measurable relevance gains across production search systems.',
    risks: 'Less direct GenAI product experience than top match.',
  },
  {
    id: 'CAN-3187',
    name: 'Meera Iyer',
    current: 'Applied AI Product Engineer',
    company: 'PeopleOS',
    location: 'Chennai',
    score: 84,
    confidence: 'Medium',
    stage: 'Review',
    experience: '5 yrs',
    lastActive: '4h ago',
    skills: ['Prompting', 'React', 'Python', 'Analytics', 'User research'],
    signals: {
      roleFit: 82,
      trajectory: 88,
      behavior: 91,
      evidence: 76,
    },
    why:
      'Balanced product and AI execution profile with strong behavioral signals from collaboration history.',
    risks: 'Needs deeper ranking model ownership evidence.',
  },
  {
    id: 'CAN-4410',
    name: 'Karthik Rao',
    current: 'Data Scientist',
    company: 'WorkLens',
    location: 'Pune',
    score: 78,
    confidence: 'Medium',
    stage: 'Review',
    experience: '4.5 yrs',
    lastActive: '3d ago',
    skills: ['NLP', 'Classification', 'SQL', 'Dashboards', 'Python'],
    signals: {
      roleFit: 75,
      trajectory: 81,
      behavior: 74,
      evidence: 80,
    },
    why:
      'Good NLP and analytics foundation, with promising career progression into hiring intelligence.',
    risks: 'Semantic retrieval and production API experience are thinner.',
  },
];

const defaultJobDescription =
  'We need an AI engineer to build a recruiter-grade candidate ranking system. The role requires semantic search, LLM evaluation, embeddings, backend APIs, explainable scoring, and practical product judgment for hiring workflows.';

const rankingWeights = [
  { label: 'Role fit', value: 42 },
  { label: 'Career trajectory', value: 22 },
  { label: 'Behavioral signals', value: 18 },
  { label: 'Evidence quality', value: 18 },
];

function ScoreBar({ label, value }) {
  return (
    <div className="score-bar">
      <div className="score-bar__meta">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="score-bar__track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <article
      className={`candidate-card ${selected ? 'candidate-card--selected' : ''}`}
      onClick={() => onSelect(candidate)}
    >
      <div className="candidate-card__rank">
        <strong>{candidate.score}</strong>
        <span>fit</span>
      </div>
      <div className="candidate-card__body">
        <div className="candidate-card__heading">
          <div>
            <p className="eyebrow">{candidate.id}</p>
            <h3>{candidate.name}</h3>
          </div>
          <span className={`pill pill--${candidate.confidence.toLowerCase()}`}>
            {candidate.confidence}
          </span>
        </div>
        <p className="candidate-card__role">
          {candidate.current} at {candidate.company}
        </p>
        <div className="candidate-card__facts">
          <span>{candidate.location}</span>
          <span>{candidate.experience}</span>
          <span>Active {candidate.lastActive}</span>
        </div>
        <div className="skill-row">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function App() {
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]);
  const [minScore, setMinScore] = useState(75);
  const [mode, setMode] = useState('hybrid');

  const shortlistedCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.score >= minScore),
    [minScore],
  );

  const selectedRank =
    candidates.findIndex((candidate) => candidate.id === selectedCandidate.id) + 1;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">CR</span>
          <div>
            <p className="eyebrow">Candidate Ranking AI</p>
            <h1>Recruiter-grade shortlist</h1>
          </div>
        </div>

        <section className="panel job-panel">
          <div className="section-heading">
            <p className="eyebrow">Input</p>
            <h2>Job understanding</h2>
          </div>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            aria-label="Job description"
          />
          <div className="jd-insights">
            <span>Semantic search</span>
            <span>LLM ranking</span>
            <span>Evidence checks</span>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Data</p>
            <h2>Candidate sources</h2>
          </div>
          <div className="source-list">
            <div>
              <strong>Profiles</strong>
              <span>Parsed resumes and career history</span>
            </div>
            <b>1,248</b>
          </div>
          <div className="source-list">
            <div>
              <strong>Activity</strong>
              <span>Projects, assessments, platform signals</span>
            </div>
            <b>83%</b>
          </div>
          <button className="secondary-button" type="button">
            Upload dataset
          </button>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Ranked output</p>
            <h2>{shortlistedCandidates.length} recommended candidates</h2>
          </div>
          <div className="topbar__actions">
            <button className="ghost-button" type="button">
              Export CSV
            </button>
            <button className="primary-button" type="button">
              Run ranking
            </button>
          </div>
        </header>

        <section className="control-strip">
          <label>
            <span>Ranking mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="hybrid">Hybrid semantic + LLM</option>
              <option value="semantic">Semantic only</option>
              <option value="llm">LLM judge only</option>
            </select>
          </label>
          <label>
            <span>Minimum fit score</span>
            <input
              type="range"
              min="60"
              max="95"
              value={minScore}
              onChange={(event) => setMinScore(Number(event.target.value))}
            />
            <b>{minScore}</b>
          </label>
          <div className="status-chip">
            <span />
            {mode === 'hybrid' ? 'Balanced ranking active' : 'Ranking mode updated'}
          </div>
        </section>

        <div className="content-grid">
          <section className="candidate-list" aria-label="Candidate shortlist">
            {shortlistedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={candidate.id === selectedCandidate.id}
                onSelect={setSelectedCandidate}
              />
            ))}
          </section>

          <aside className="inspector">
            <section className="panel selected-panel">
              <div className="selected-panel__top">
                <div>
                  <p className="eyebrow">Candidate #{selectedRank}</p>
                  <h2>{selectedCandidate.name}</h2>
                  <p>
                    {selectedCandidate.current} at {selectedCandidate.company}
                  </p>
                </div>
                <div className="score-orbit">
                  <strong>{selectedCandidate.score}</strong>
                  <span>match</span>
                </div>
              </div>
              <p className="explanation">{selectedCandidate.why}</p>
              <div className="risk-box">
                <strong>Watch point</strong>
                <span>{selectedCandidate.risks}</span>
              </div>
            </section>

            <section className="panel">
              <div className="section-heading">
                <p className="eyebrow">Why this rank</p>
                <h2>Fit signals</h2>
              </div>
              {Object.entries(selectedCandidate.signals).map(([key, value]) => (
                <ScoreBar
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={value}
                />
              ))}
            </section>

            <section className="panel model-panel">
              <div className="section-heading">
                <p className="eyebrow">Scoring recipe</p>
                <h2>Weighted judgement</h2>
              </div>
              <div className="weight-map">
                {rankingWeights.map((weight) => (
                  <div key={weight.label} style={{ '--weight': weight.value }}>
                    <span>{weight.label}</span>
                    <strong>{weight.value}%</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;
