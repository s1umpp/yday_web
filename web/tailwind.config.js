module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // yday dark moody palette from logo.jpg
        yday: {
          dark: '#0a0f1a',      // Deep dark blue-black
          navy: '#141e30',      // Dark navy
          blue: '#1a3a5c',      // Muted blue
          purple: '#2d2545',    // Deep purple
          accent: '#4a6fa5',    // Muted accent blue
          text: '#8b9dc3',      // Muted text
          light: '#c5d0e6',     // Light text
        }
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'yday-gradient': 'linear-gradient(135deg, #0a0f1a 0%, #141e30 25%, #1a3a5c 50%, #2d2545 75%, #141e30 100%)',
        'yday-radial': 'radial-gradient(ellipse at center, #1a3a5c 0%, #141e30 50%, #0a0f1a 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
