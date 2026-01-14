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
          DEFAULT: '#E1306C',
          light: '#FD1D1D',
          dark: '#C13584',
          gradient: {
            start: '#F58529',
            middle: '#DD2A7B',
            end: '#8134AF',
          },
        },
        instagram: {
          blue: '#0095F6',
          lightBlue: '#E0F1FF',
          border: '#DBDBDB',
          background: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
};
