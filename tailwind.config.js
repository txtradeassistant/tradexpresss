/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.html",                    // Scans all HTML files in your root directory
    "./*.js",                      // Scans all JS files in your root directory (like tradexpress.js)
    "./app/**/*.{js,ts,jsx,tsx}",  // Scans your React app directory
    "./components/**/*.{js,ts,jsx,tsx}", // Scans your components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}