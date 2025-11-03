/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          secondary: '#059669',
          light: '#f0fdfa',
        },
      },
    },
  },
  plugins: [],
};
