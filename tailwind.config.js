// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"], // pastikan ini sesuai
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography') // ✅ di sini tempatnya
  ],
}
