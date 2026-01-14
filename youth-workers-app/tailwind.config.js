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
          DEFAULT: '#007AFF',
          light: '#5AC8FA',
          dark: '#0051D5',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#636366',
          800: '#48484A',
          900: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '13px', letterSpacing: '0.06px' }],
        'sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],
        'base': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px' }],
        'lg': ['20px', { lineHeight: '25px', letterSpacing: '0.38px' }],
        'xl': ['28px', { lineHeight: '34px', letterSpacing: '0.36px' }],
        '2xl': ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
        '3xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.01px' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'lg': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'DEFAULT': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
