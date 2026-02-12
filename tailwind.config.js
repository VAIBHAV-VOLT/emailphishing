/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: [
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Inter',
            'SF Pro Text',
            'ui-sans-serif',
            'sans-serif',
          ],
        },
      },
    },
    plugins: [],
  };