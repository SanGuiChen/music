/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite'
      }
    },
    container: {
      center: true
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      bgColor: '#fefefe'
    })
  },
  variants: {
    extend: {}
  },
  plugins: []
};
