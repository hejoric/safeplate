/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#87A96B',
        warmbeige: '#F5E6D3',
        coral: '#FF9F89',
        warning: '#FFD97D',
        critical: '#FF6B6B',
        offwhite: '#FAFAF9',
        darkgray: '#2D3748',
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
          primary: '#87A96B',
          secondary: '#F5E6D3',
          accent: '#FF9F89',
          warning: '#FFD97D',
          error: '#FF6B6B',
          'base-100': '#FAFAF9',
          'base-content': '#2D3748',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}
