/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f5f3ef',
        surface: '#ffffff',
        foreground: '#1a1a1a',
        muted: '#737373',
        border: '#e8e6e2',
        accent: '#1a1a1a',
        'accent-foreground': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        card: '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

