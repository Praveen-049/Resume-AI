import { motion } from 'framer-motion';

export function ProgressBar({ value, color = 'from-electric to-cyan' }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </div>
  );
}

export function CircularProgress({ value, label }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="glass flex min-h-[178px] flex-col items-center justify-center rounded-2xl border border-white/10 p-5">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeLinecap="round"
            strokeWidth="8"
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (value / 100) * circumference }}
            strokeDasharray={circumference}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0" x2="1">
              <stop stopColor="#4F8EF7" />
              <stop offset="0.5" stopColor="#21D4FD" />
              <stop offset="1" stopColor="#7C4DFF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-xl font-semibold text-white">{value}%</div>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-slate-200">{label}</p>
    </div>
  );
}
