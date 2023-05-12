const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        primary: {
          text: '#FFF',
          button: '#1D4AE0',
          buttonHover: '#133eca',
          textBlue: '#0057FF',
        },
        gray: {
          text: '#FFFFFFB2',
          inactive: '#838ead',
          bg: '#F9FAFB',
          border: '#ffffff2b',
          unaryBorder: '#69696A',
          navBtnBg: '#FFFFFF1A',
        },
        blue: {
          bg: '#040E31',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
