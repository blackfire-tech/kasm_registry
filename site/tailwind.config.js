/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blackfire "fire" gradient stops, sampled from the logo mark.
        fire: {
          amber: '#F7A23B',
          orange: '#F26B21',
          red: '#E8392B',
          crimson: '#C42A3A',
          maroon: '#5E2A41',
        },
        // Near-black surfaces for the dark "Blackfire" theme.
        ink: {
          950: '#0A0A0C',
          900: '#101013',
          850: '#16161A',
          800: '#1E1E24',
          700: '#2A2A32',
          600: '#3A3A44',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      backgroundImage: {
        'fire-gradient':
          'linear-gradient(135deg, #F7A23B 0%, #F26B21 35%, #E8392B 70%, #7A2A45 100%)',
      },
      boxShadow: {
        fire: '0 8px 24px -6px rgba(242, 107, 33, 0.45)',
      },
    },
  },
  plugins: [],
}
