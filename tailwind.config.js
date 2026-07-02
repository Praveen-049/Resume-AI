/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050713',
        panel: '#0B1020',
        electric: '#4F8EF7',
        violet: '#7C4DFF',
        cyan: '#21D4FD',
      },
      boxShadow: {
        glow: '0 0 40px rgba(79, 142, 247, 0.28)',
        violet: '0 0 48px rgba(124, 77, 255, 0.26)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -18px, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
      },
      animation: {
        gradient: 'gradientShift 14s ease infinite',
        float: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
