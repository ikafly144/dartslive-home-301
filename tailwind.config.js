/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dart: {
          bg: "#0B0E14",
          surface: "#151B26",
          card: "#1C2433",
          border: "#2A364F",
          cyan: "#00F0FF",
          neonRed: "#FF2A5F",
          neonGreen: "#00FF85",
          neonYellow: "#FFD000",
          bullRed: "#E51D38",
          boardBlack: "#1A1A1A",
          boardWhite: "#E2DAC8",
          boardRed: "#D8262C",
          boardGreen: "#0F7A3D",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Oswald"', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4)',
        'neon-red': '0 0 15px rgba(255, 42, 95, 0.4)',
        'neon-green': '0 0 15px rgba(0, 255, 133, 0.4)',
        'neon-yellow': '0 0 15px rgba(255, 208, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
