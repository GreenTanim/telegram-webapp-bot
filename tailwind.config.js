/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#0088cc',
          light: '#54a9eb',
          dark: '#006ba1',
        },
      },
    },
  },
  plugins: [],
}
