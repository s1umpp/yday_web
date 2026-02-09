module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        yday: {
          dark: '#0a0f1a',
          navy: '#141e30',
          blue: '#1a3a5c',
          purple: '#2d2545',
          accent: '#4a6fa5',
          text: '#8b9dc3',
          light: '#c5d0e6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
