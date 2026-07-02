import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  ChevronRight,
  FileSearch,
  Github,
  LayoutDashboard,
  LineChart,
  Menu,
  Settings,
  Sparkles,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { candidates, distributionData, funnelData, radarData, skillData } from './data/candidates';
import { CircularProgress, ProgressBar } from './components/Progress';
import { GlassCard, Section, fadeUp } from './components/Motion';

const features = [
  ['Semantic Candidate Matching', Brain, 'Understands intent, adjacent skills, and domain depth beyond literal resume terms.'],
  ['AI Resume Understanding', FileSearch, 'Extracts seniority, impact, scope, and project relevance from unstructured profiles.'],
  ['Behavioral Signal Analysis', Activity, 'Scores responsiveness, stability, growth signals, and hiring readiness patterns.'],
  ['Hybrid AI Ranking', BarChart3, 'Combines semantic match, structured filters, behavior signals, and recruiter priorities.'],
  ['Explainable AI', Sparkles, 'Turns ranking decisions into concise reasons, strengths, weaknesses, and confidence scores.'],
  ['Recruiter Dashboard', Users, 'Gives teams a focused command center for shortlist review, funnel analytics, and action.'],
];

const workflow = [
  ['Upload Job Description', 'Parse the role context, business needs, and constraints.'],
  ['AI extracts skills, experience, seniority, and responsibilities', 'Create a structured hiring signal map.'],
  ['Read Candidate Profiles', 'Normalize resumes, public profiles, portfolios, and activity trails.'],
  ['Semantic Matching', 'Compare meaning, depth, and transferability.'],
  ['Behavioral Signal Analysis', 'Measure readiness, engagement, and reliability.'],
  ['Hybrid AI Scoring', 'Blend model reasoning with deterministic ranking rules.'],
  ['LLM Reasoning', 'Generate explanations recruiters can trust and challenge.'],
  ['Top 100 Ranked Candidates', 'Deliver the highest quality shortlist for review.'],
];

const stats = [
  ['Candidates Analyzed', '100,000'],
  ['Job Match Accuracy', '96%'],
  ['Average Ranking Time', '2.8 min'],
  ['Top Candidates', '100'],
];

const nav = ['Features', 'Workflow', 'Dashboard', 'About'];
const chartColors = ['#4F8EF7', '#7C4DFF', '#21D4FD', '#8DEBFF'];

function App() {
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white">
      <BackgroundFX />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <Features />
      <Workflow />
      <DashboardPreview onSelect={setActiveCandidate} />
      <Analytics />
      <Footer />
      <CandidateDrawer candidate={activeCandidate} onClose={() => setActiveCandidate(null)} />
    </main>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,142,247,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(124,77,255,0.18),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(33,212,253,0.12),transparent_34%)]" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-electric/20 blur-3xl animate-pulseGlow" />
      <div className="absolute -right-24 top-60 h-80 w-80 rounded-full bg-violet/20 blur-3xl animate-float" />
      <div className="absolute bottom-28 left-8 h-72 w-72 rounded-full bg-cyan/15 blur-3xl animate-float" />
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-cyan/60 shadow-[0_0_18px_rgba(33,212,253,0.9)]"
          style={{
            left: `${(index * 29) % 100}%`,
            top: `${(index * 47) % 100}%`,
            animation: `float ${5 + (index % 6)}s ease-in-out ${index * 0.13}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/65 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-electric via-cyan to-violet shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          ResumeAI
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-300 transition hover:text-white">
              {item}
            </a>
          ))}
          <a className="glass inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:border-cyan/50" href="#">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 md:hidden">
          {nav.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-3 text-sm text-slate-200">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <motion.div className="max-w-5xl" initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
        <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-4 py-2 text-sm text-cyan">
          <Sparkles className="h-4 w-4" />
          AI-powered candidate discovery and ranking
        </motion.div>
        <motion.h1 variants={fadeUp} className="max-w-5xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
          AI That Understands Talent Beyond Keywords
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          ResumeAI intelligently ranks candidates using semantic understanding, behavioral signals, career progression, and AI reasoning instead of simple keyword matching.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-4 sm:flex-row">
          <RippleButton icon={UploadCloud}>Upload Job Description</RippleButton>
          <RippleButton variant="secondary" icon={LayoutDashboard}>View Demo</RippleButton>
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-14 grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
      >
        {['Semantic reasoning', 'Behavior intelligence', 'Explainable shortlist'].map((item) => (
          <div key={item} className="glass rounded-2xl border border-white/10 p-4 text-sm text-slate-200">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_#21D4FD]" />
            {item}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function RippleButton({ children, icon: Icon, variant = 'primary' }) {
  const classes =
    variant === 'primary'
      ? 'bg-gradient-to-r from-electric via-cyan to-violet text-white shadow-glow'
      : 'glass border border-white/10 text-white hover:border-cyan/50';
  return (
    <motion.button
      className={`relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition ${classes}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-120%', opacity: 0 }}
        whileHover={{ x: '120%', opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <Icon className="relative h-4 w-4" />
      <span className="relative">{children}</span>
    </motion.button>
  );
}

function Features() {
  return (
    <Section id="features">
      <SectionHeader eyebrow="Features" title="A ranking engine built for modern hiring signals" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, Icon, text], index) => (
          <GlassCard key={title} delay={index * 0.06} className="p-6">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-cyan shadow-glow">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Workflow() {
  return (
    <Section id="workflow">
      <SectionHeader eyebrow="Workflow" title="From job intent to ranked candidate intelligence" />
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-electric via-cyan to-violet sm:block" />
        {workflow.map(([title, body], index) => (
          <motion.div
            key={title}
            className="relative mb-5 flex gap-5"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.55, delay: index * 0.04 }}
          >
            <div className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan/40 bg-panel text-sm font-semibold shadow-glow">
              {index + 1}
            </div>
            <div className="glass w-full rounded-2xl border border-white/10 p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function DashboardPreview({ onSelect }) {
  return (
    <Section id="dashboard" className="max-w-[1500px]">
      <SectionHeader eyebrow="Dashboard" title="A realistic recruiter command center" />
      <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-violet">
        <div className="grid min-h-[760px] lg:grid-cols-[240px_1fr]">
          <Sidebar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm text-cyan">AI Ranking Workspace</p>
                <h2 className="mt-1 text-2xl font-semibold">Senior AI Engineer Search</h2>
              </div>
              <RippleButton icon={Sparkles}>Generate Shortlist</RippleButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <CandidateTable onSelect={onSelect} />
              <Charts />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Sidebar() {
  const items = [
    [LayoutDashboard, 'Dashboard'],
    [Users, 'Candidates'],
    [BriefcaseBusiness, 'Jobs'],
    [BarChart3, 'Rankings'],
    [LineChart, 'Analytics'],
    [Settings, 'Settings'],
  ];
  return (
    <aside className="border-b border-white/10 bg-white/[0.035] p-4 lg:border-b-0 lg:border-r">
      <div className="mb-8 flex items-center gap-2 font-semibold">
        <Sparkles className="h-5 w-5 text-cyan" />
        ResumeAI
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {items.map(([Icon, label], index) => (
          <button
            key={label}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
              index === 0 ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function CandidateTable({ onSelect }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <h3 className="font-semibold">Top Ranked Candidates</h3>
        <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs text-cyan">Live scoring</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {['Rank', 'Candidate', 'Score', 'Experience', 'Skills', 'Behavior Score', 'Recommendation'].map((head) => (
                <th key={head} className="px-5 py-4 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.name} className="border-t border-white/10 transition hover:bg-white/[0.035]">
                <td className="px-5 py-4 font-semibold text-cyan">#{candidate.rank}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric to-violet text-sm font-semibold">
                      {candidate.name.split(' ').map((part) => part[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-xs text-slate-400">{candidate.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex min-w-28 items-center gap-3">
                    <ProgressBar value={candidate.score} />
                    <span className="w-12 text-xs text-slate-300">{candidate.score}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-300">{candidate.experience}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">{skill}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">{candidate.behaviorScore}</span>
                </td>
                <td className="px-5 py-4">
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-white transition hover:border-cyan/50 hover:bg-cyan/10"
                    onClick={() => onSelect(candidate)}
                  >
                    View Profile
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Charts() {
  return (
    <div className="grid gap-4">
      <ChartCard title="Candidate Distribution">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={distributionData}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area dataKey="candidates" stroke="#4F8EF7" fill="#4F8EF7" fillOpacity={0.22} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <ChartCard title="Skill Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={skillData} innerRadius={46} outerRadius={72} paddingAngle={4} dataKey="value">
                {skillData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Hiring Funnel">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={funnelData}>
              <XAxis dataKey="stage" stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#7C4DFF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <ChartCard title="Behavioral Signal Radar">
        <ResponsiveContainer width="100%" height={210}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis dataKey="signal" tick={{ fill: '#CBD5E1', fontSize: 10 }} />
            <Radar dataKey="score" stroke="#21D4FD" fill="#21D4FD" fillOpacity={0.28} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const tooltipStyle = {
  background: 'rgba(5, 7, 19, 0.92)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: '#fff',
};

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Analytics() {
  const metrics = [
    ['Semantic Match', 96],
    ['Technical Match', 92],
    ['Behavior Match', 89],
    ['Culture Fit', 87],
    ['Career Stability', 84],
  ];
  return (
    <Section id="about">
      <SectionHeader eyebrow="Analytics" title="Explainable signals for confident hiring decisions" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(([label, value]) => <CircularProgress key={label} label={label} value={value} />)}
      </div>
    </Section>
  );
}

function CandidateDrawer({ candidate, onClose }) {
  return (
    <AnimatePresence>
      {candidate && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#080B18]/95 p-6 shadow-violet backdrop-blur-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan">#{candidate.rank} Recommended Candidate</p>
                <h2 className="mt-1 text-2xl font-semibold">{candidate.name}</h2>
                <p className="text-slate-400">{candidate.company} · {candidate.experience}</p>
              </div>
              <button className="rounded-lg border border-white/10 p-2 hover:bg-white/10" onClick={onClose} aria-label="Close profile drawer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DrawerBlock title="Professional Summary">
              <p className="text-sm leading-6 text-slate-300">{candidate.summary}</p>
            </DrawerBlock>
            <DrawerBlock title="Skills">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => <span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-sm">{skill}</span>)}
              </div>
            </DrawerBlock>
            <DrawerBlock title="Career Timeline">
              <div className="space-y-3">
                {candidate.timeline.map((item) => (
                  <div key={item} className="border-l border-cyan/40 pl-4 text-sm text-slate-300">{item}</div>
                ))}
              </div>
            </DrawerBlock>
            <div className="grid gap-3 sm:grid-cols-2">
              <Signal label="Profile Completeness" value={candidate.completeness} />
              <Signal label="Recruiter Response Rate" value={candidate.responseRate} />
              <Signal label="GitHub Activity" value={candidate.github} />
              <Signal label="Interview Completion" value={candidate.interview} />
            </div>
            <DrawerBlock title="AI Recommendation">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-cyan/10 p-4">
                <span>{candidate.recommendation}</span>
                <span className="font-semibold text-cyan">{candidate.confidence}% confidence</span>
              </div>
              <p className="text-sm text-slate-300">Expected Salary: {candidate.salary}</p>
            </DrawerBlock>
            <DrawerBlock title="Reasons">
              <ul className="space-y-2 text-sm text-slate-300">
                {candidate.signals.map((signal) => <li key={signal}>• {signal}</li>)}
              </ul>
            </DrawerBlock>
            <div className="grid gap-4 sm:grid-cols-2">
              <DrawerBlock title="Strengths">
                <ul className="space-y-2 text-sm text-slate-300">
                  {candidate.strengths.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </DrawerBlock>
              <DrawerBlock title="Weaknesses">
                <ul className="space-y-2 text-sm text-slate-300">
                  {candidate.weaknesses.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </DrawerBlock>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerBlock({ title, children }) {
  return (
    <section className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      {children}
    </section>
  );
}

function Signal({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-cyan">{value}%</span>
      </div>
      <ProgressBar value={value} color="from-cyan to-violet" />
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-slate-400 md:flex-row md:items-center">
        <p>Built for the Redrob AI Candidate Discovery & Ranking Challenge.</p>
        <div className="flex flex-wrap gap-5">
          {['GitHub', 'Documentation', 'About', 'Contact'].map((link) => <a key={link} href="#" className="hover:text-white">{link}</a>)}
        </div>
      </div>
    </footer>
  );
}

export default App;
