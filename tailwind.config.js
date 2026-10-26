/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Turkish turquoise palette — now mapped to the EXACT Tailwind teal
        // scale so every component renders in the v0 premium design system
        // (teal-600 / teal-700 / cyan-500 gradients, teal chips, teal rings).
        turk: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Warm rose accents — mapped to the Tailwind rose scale
        alem: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flame: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wave: {
          '0%,100%': { transform: 'scaleY(.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        fadein: 'fadeIn .35s ease-out',
        pop: 'pop .25s ease-out',
        flame: 'flame 2.2s ease-in-out infinite',
        slideup: 'slideUp .4s ease-out',
      },
    },
  },
  plugins: [],
}
