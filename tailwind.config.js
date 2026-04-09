/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#1e1e2e',
          surface: '#252535',
          panel: '#2a2a3c',
          border: '#363650',
          hover: '#32324a',
          active: '#3d3d5c',
          text: '#cdd6f4',
          'text-dim': '#6c7086',
          'text-bright': '#f5f5ff',
          accent: '#89b4fa',
          'accent-dim': '#45475a',
          warning: '#f9e2af',
          error: '#f38ba8',
          success: '#a6e3a1',
        },
        cc: {
          white: '#F0F0F0',
          orange: '#F2B233',
          magenta: '#E57FD8',
          lightBlue: '#99B2F2',
          yellow: '#DEDE6C',
          lime: '#7FCC19',
          pink: '#F2B2CC',
          gray: '#4C4C4C',
          lightGray: '#999999',
          cyan: '#4C99B2',
          purple: '#B266E5',
          blue: '#3366CC',
          brown: '#7F664C',
          green: '#57A64E',
          red: '#CC4C4C',
          black: '#111111',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
