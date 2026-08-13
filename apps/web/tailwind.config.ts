import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111513',
        forest: '#245c47',
        mint: '#b9d8c8',
        cream: '#191d1b',
        amber: '#c88a3e',
      },
      boxShadow: { soft: '0 18px 50px rgba(0,0,0,.22)' },
    },
  },
  plugins: [],
} satisfies Config;
