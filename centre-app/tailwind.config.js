/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#2c2c2c',
        white: '#ffffff',
        gray: {
          DEFAULT: '#888888',
          light: '#bbbbbb',
          light2: '#eeeeee',
          dark: '#555555',
        },
        primary: {
          DEFAULT: '#3399ff',
          light: '#66b3ff',
          dark: '#004e85',
        },
        // Uncomment and adjust if you want secondary colors too
        // secondary: {
        //   DEFAULT: 'hsl(30, 100%, 50%)',
        //   light: 'hsl(30, 100%, 65%)',
        //   dark: 'hsl(30, 100%, 40%)',
        // },
      },
    },
  },
  plugins: [],
};
