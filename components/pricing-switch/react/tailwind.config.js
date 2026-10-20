/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Saira Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: { volt: '#C6FF3D', ultra: '#8B6CFF', ink: '#0A0A0D', panel: '#111218', line: '#262A36', muted: '#8A8FA3' },
    },
  },
  plugins: [],
};
