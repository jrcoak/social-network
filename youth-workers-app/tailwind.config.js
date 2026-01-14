/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0078D4',
          light: '#50E6FF',
          dark: '#005A9E',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E1E1E1',
          300: '#CFCFCF',
          400: '#B3B3B3',
          500: '#8A8A8A',
          600: '#6D6D6D',
          700: '#505050',
          800: '#323232',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
      },
    },
  },
  plugins: [],
};
