/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0a', // Deep black background
          orange: '#f97316', // Bright orange accent
          gray: '#1f2937', // Dark gray for input fields/cards
          text: '#f3f4f6' // High contrast white for typography
        }
      }
    },
  },
  plugins: [],
}