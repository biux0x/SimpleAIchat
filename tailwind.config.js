/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono', 
          'SF Mono', 
          'Menlo', 
          'Monaco', 
          'Consolas',
          'Liberation Mono', 
          'Courier New', 
          'monospace'
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(59, 130, 246, 0.5)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.md'),
              paddingTop: theme('spacing.1'),
              paddingBottom: theme('spacing.1'),
              paddingLeft: theme('spacing.1'),
              paddingRight: theme('spacing.1'),
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};