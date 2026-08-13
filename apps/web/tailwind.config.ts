import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b',
        forest: '#173f32',
        mint: '#dff2e7',
        cream: '#f6f4ed',
        amber: '#e9a23b',
      },
      boxShadow: { soft: '0 14px 40px rgba(23,33,27,.08)' },
    },
  },
  plugins: [],
} satisfies Config;
