/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // screens: {
    // sm: '640px',
    // md: '768px',
    // lg: '1024px',
    // xl: '1280px',
    // '2xl': '1536px',
    // },
    extend: {
      fontFamily: {
        // sans: ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // https://coolors.co/1c1c1c-ededed-fdfdfd-ffdf3d-388201-fff7a3-ffe0eb
        black: '#1C1C1C',
        gray: '#EDEDED',
        white: '#FDFDFD', // true white
        lemon: '#FFDF3D',
        'lemon-leaf': '#388201',
        lemonade: '#FFF7A3',
        'pink-lemonade': '#FFE0EB',
      },
    },
  },
  plugins: [],
};
