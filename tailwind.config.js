/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Add paths to your HTML files or other relevant files that use Tailwind
    "./src/**/*.{js,ts,jsx,tsx}", // Or adjust this path according to your project structure
    // If you're using Tauri with React or similar, ensure paths reflect where your components are
  ],
  darkMode: 'class', // Enable class-based dark mode (can also use 'media' for system preference)
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
    },
  },
  plugins: [],
}
