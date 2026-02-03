/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#1a1a2e',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
