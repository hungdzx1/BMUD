/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1d',
          card: '#111827',
          border: '#1f293d',
          accent: '#3b82f6',
          vulnerable: '#ef4444',
          vulnerableLight: '#f87171',
          secure: '#10b981',
          secureLight: '#34d399',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
