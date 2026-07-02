import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Section({ id, className = '', children }) {
  return (
    <motion.section
      id={id}
      className={`relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

export function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`glass rounded-2xl border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
