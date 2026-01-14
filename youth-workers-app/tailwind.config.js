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
      boxShadow: {
        'sm': '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
        'md': '0 3.2px 7.2px 0 rgba(0,0,0,.132), 0 0.6px 1.8px 0 rgba(0,0,0,.108)',
        'lg': '0 6.4px 14.4px 0 rgba(0,0,0,.132), 0 1.2px 3.6px 0 rgba(0,0,0,.108)',
        'xl': '0 25.6px 57.6px 0 rgba(0,0,0,.22), 0 4.8px 14.4px 0 rgba(0,0,0,.18)',
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
