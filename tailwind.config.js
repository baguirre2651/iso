/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        swiss: ['Manrope', 'sans-serif'],
        mono: ['monospace'],
        filter: ['Public Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}