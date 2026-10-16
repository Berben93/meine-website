/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        // Logofarbe #003A6D = brand-700
        brand: {
          50: '#eef5fb', 100: '#d7e6f4', 200: '#afcbe8', 300: '#7ea9d6', 400: '#4b85c0',
          500: '#2566a8', 600: '#0f4f8e', 700: '#003a6d', 800: '#002e57', 900: '#002244', 950: '#00152b',
        },
        accent: { 400: '#38bdf8', 500: '#0ea5e9' },
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
};
