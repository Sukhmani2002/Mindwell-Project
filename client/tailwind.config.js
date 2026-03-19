module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4', 100: '#e3ebe3', 200: '#c8d9c8',
          300: '#a2bfa2', 400: '#759f76', 500: '#548255',
          600: '#406641', 700: '#325232', 800: '#294229', 900: '#233823'
        },
        lavender: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
          300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6',
          600: '#7c3aed', 700: '#6d28d9'
        },
        calm: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd',
          300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9'
        },
        warm: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
          300: '#fdba74', 400: '#fb923c', 500: '#f97316'
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
        sans: ['Gill Sans', 'Optima', 'Segoe UI', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideUp': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'ripple': 'ripple 1s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-15px)' } },
        breathe: { '0%, 100%': { transform: 'scale(1)', opacity: '0.7' }, '50%': { transform: 'scale(1.3)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'pulse-soft': { '0%, 100%': { opacity: '0.6', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.05)' } },
        ripple: { '0%': { transform: 'scale(0)', opacity: '1' }, '100%': { transform: 'scale(4)', opacity: '0' } }
      }
    }
  },
  plugins: []
};
