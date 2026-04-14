/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          orangeHover: '#e68a00',
          orangeLight: '#fff3cd',
          dark: '#131921',
          darkLight: '#232f3e',
          blue: '#146EB4',
          blueLight: '#e8f4fd',
          teal: '#007185',
          tealHover: '#c4f6e3',
          red: '#CC0C39',
          green: '#007600',
          yellow: '#F0C14B',
          yellowHover: '#DDB347',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
