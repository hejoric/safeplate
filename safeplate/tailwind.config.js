/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#B8AA87',
        warmbeige: '#D7C5A6',
        coral: '#B89A76',
        warning: '#C9A86A',
        critical: '#C27A6D',
        offwhite: '#3B352D',
        darkgray: '#D7C5A6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        safeplate: {
          primary: '#c6b893',
          'primary-content': '#2A241E',
          secondary: '#8F846A',
          'secondary-content': '#F3E9D5',
          accent: '#A99776',
          warning: '#C9A86A',
          error: '#C27A6D',
          neutral: '#2F2922',
          'base-100': '#3B352D',
          'base-200': '#332D25',
          'base-300': '#474036',
          'base-content': '#D7C5A6',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}
