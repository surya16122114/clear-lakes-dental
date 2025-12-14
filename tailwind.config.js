/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure all utility classes are included (no purging of important classes)
  safelist: [
    'mt-48',
    'md:mt-32',
    'top-4',
    'md:top-8',
    'z-20',
    'z-10',
    'fixed',
    'inset-0',
    'absolute',
    'relative',
  ],
}

