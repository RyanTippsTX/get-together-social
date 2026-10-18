/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: { xs: '400px' },
      fontFamily: {
        sans: ['DM Sans Variable', 'system-ui', 'sans-serif'],
        display: ['Nunito Sans Variable', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#19231d',
        muted: '#63665b',
        cream: '#fffdf5',
        butter: '#fff8d8',
        lemon: '#ffd629',
        'lemon-leaf': '#3d644e',
        lemonade: '#fff3b0',
        'pink-lemonade': '#fff0e6',
        dark: '#19231d',
        light: '#eee9d8',
        primary: '#ffd629',
        secondary: '#fff3b0',
        accent: '#3d644e',
        'base-100': '#fffdf5',
        error: '#b53c27',
        success: '#3d644e',
        warning: '#b86420',
      },
      boxShadow: { custom: '0 12px 40px -16px rgb(70 55 20 / 18%)' },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
