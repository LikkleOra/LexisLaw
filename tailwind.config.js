/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        black2: '#111111',
        black3: '#1A1A1A',
        card: '#1E1E1E',
        card2: '#252525',
        red: {
          DEFAULT: '#E63329',
          dark: '#9E1F18',
          glow: 'rgba(230, 51, 41, 0.15)',
        },
        green: {
          DEFAULT: '#2DB34A',
          dark: '#1B7A30',
        },
        grey: {
          DEFAULT: '#8A8A8A',
          light: '#B0B0B0',
        },
        white: '#F5F5F5',
        border: 'rgba(138, 138, 138, 0.25)',
        'border-strong': 'rgba(138, 138, 138, 0.5)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier Prime', 'monospace'],
      },
    },
  },
  plugins: [],
};
