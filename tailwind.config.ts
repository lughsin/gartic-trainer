import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        panel: '#111933',
        neonCyan: '#22d3ee',
        neonPink: '#ec4899',
        neonOrange: '#f97316',
        neonYellow: '#facc15'
      },
      boxShadow: {
        neon: '0 0 24px rgba(34,211,238,.25)'
      }
    }
  },
  plugins: []
} satisfies Config;
