/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '10xl': '10rem',
        '20xl': '20rem',
        '25xl': '25rem',
        '30xl': '30rem',
        '35xl': '35rem',
        '40xl': '40rem',
      }
    },
  },
  plugins: [],
}