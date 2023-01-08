/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    container: {
      center: true
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
