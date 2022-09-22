/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

const brandColors = {
  // https://coolors.co/1c1c1c-ededed-fdfdfd-ffdf3d-388201-fff7a3-ffe0eb
  black: '#1C1C1C',
  dark: '#27272A', // bg-zinc-800
  gray: '#EDEDED',
  light: '#EDEDED', // a very light gray, just enough to contrast with white
  white: '#FDFDFD', // true white
  lemon: '#FFDF3D',
  'lemon-leaf': '#388201',
  lemonade: '#FFF7A3',
  'pink-lemonade': '#FFE0EB',
};

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      // lg: '1024px',
      // xl: '1280px',
      // '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans], // uniform look on all platforms
      },
      colors: brandColors,
      boxShadow: {
        custom: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(-25%) scale(1.1);' },
          '25%, 100%': { transform: 'translateY(0%)' },
          // '0%, 100%' {
          //   transform: translateY(-25%);
          //   animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          // }
          // 50% {
          //   transform: translateY(0);
          //   animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          // }
        },
      },
      animation: {
        drop: 'drop 1s ',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    // daisyUI config (optional)
    // https://daisyui.com/docs/config/
    styled: true,
    // themes: true,
    // themes: ['cupcake', 'dark', 'cmyk'],
    themes: [
      // 'light',
      // 'lemonade',
      // 'cupcake',
      {
        mytheme: {
          primary: brandColors.lemon,
          secondary: brandColors.lemonade,
          accent: brandColors['lemon-leaf'],
          neutral: brandColors['pink-lemonade'],
          // 'base-100': '#F5F6F9',
          'base-100': brandColors.white,
          info: '#537DDF',
          success: '#1C6E51',
          warning: '#F4B267',
          error: '#E9736D',

          '--rounded-box': '0.5rem', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-btn': '0.5rem', // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
          '--animation-btn': '0.125s', // duration of animation when you click on button
          '--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
          '--btn-text-case': 'sentence', // set default text transform for buttons
          '--btn-focus-scale': '0.95', // scale transform of button when you focus on it
          '--border-btn': '1px', // border width of buttons
          '--tab-border': '1px', // border width of tabs
          '--tab-radius': '0.5rem', // border radius of tabs
        },
      },
    ],
    base: false,
    // utils: true, // only need if using daisy util classes
    logs: false,
  },
};
