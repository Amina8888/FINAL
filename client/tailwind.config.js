/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F36',   // dark navy blue (Zoom style)
        accent: '#007FFF',    // bright blue (Toptal/Zoom)
        background: '#F9FAFB',
        border: '#E5E7EB'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

  