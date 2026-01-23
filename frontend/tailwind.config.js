/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFCE1A',
        secondary: "#0D0842",
        blackBG: '#F3F3F3',
        Favorite: '#FF5841',
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        bellmt: ['"Bell MT"', 'Georgia', 'serif'],
        'pt-serif': ['"PT Serif"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '105rem',
      },
      screens: {
        '8xl': '1440px',
        '9xl': '1650px',
      },

    },

    container: {
      center: true,
      screens: {
        xs: "425px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1920px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwind-scrollbar-hide"),
    require('@tailwindcss/line-clamp'),
  ],
};
