/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bauhaus-cream': '#fffcf2',
        'bauhaus-text': '#1a1a1b',
        'bauhaus-red': '#eb3b5a',
        'bauhaus-yellow': '#ffd500',
        'bauhaus-blue': '#003d82',
      },
      borderRadius: {
        'none': '0px',
      }
    },
  },
  plugins: [],
}
