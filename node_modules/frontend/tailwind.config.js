/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crush: {
          pink: '#ff7eb6',
          rose: '#ff4d8d',
          lavender: '#b8a7ff',
          lilac: '#d7ccff',
          milk: '#fff7fb',
        },
      },
      boxShadow: {
        soft: '0 12px 40px rgba(255, 77, 141, 0.14)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
        heartDrift: {
          '0%': { opacity: 0, transform: 'translateY(12px) scale(0.9)' },
          '10%': { opacity: 1 },
          '100%': { opacity: 0, transform: 'translateY(-220px) scale(1.25)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        fadeUp: 'fadeUp 500ms ease-out both',
        heartDrift: 'heartDrift 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

