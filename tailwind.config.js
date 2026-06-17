/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          default: '#F8F9FA',
          panel: '#FFFFFF',
          upload: '#FAFAFA',
        },
        border: {
          default: '#E5E7EB',
          hover: '#CBD5E1',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          disabled: '#94A3B8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};
