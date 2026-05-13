/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /bg-(indigo|emerald|rose|amber|violet|purple|slate)-(50|100|500|600|700)/ },
    { pattern: /text-(indigo|emerald|rose|amber|violet|purple|slate)-(50|100|400|500|600|700)/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'bounce-slow': 'bounceSlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
