/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0B0E18',
          light: '#1E293B',
          accent: '#60A5FA',
          highlight: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}