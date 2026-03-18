/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lexis-black': '#0A0A0A',
        'lexis-red': '#E63946',
        'lexis-green': '#2A9D8F',
        'lexis-grey': '#F1F1F1',
        'lexis-dark-grey': '#333333',
        card: '#1A1A1A',
        card2: '#252525',
        border: 'rgba(136, 136, 136, 0.5)',
        'border-strong': 'rgba(136, 136, 136, 0.75)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #0A0A0A',
        'brutal-lg': '8px 8px 0px 0px #0A0A0A',
        'brutal-red': '4px 4px 0px 0px #E63946',
        'brutal-green': '4px 4px 0px 0px #2A9D8F',
      },
      animation: {
        'slam-in': 'slamIn 0.5s ease-out',
        'page-in': 'pageIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        slamIn: {
          '0%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
