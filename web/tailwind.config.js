import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
}
