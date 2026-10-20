/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
      colors: { volt: '#C6FF3D', ultra: '#8B6CFF', ink: '#0A0A0D' },
    },
  },
  plugins: [],
};
