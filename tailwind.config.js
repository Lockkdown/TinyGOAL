/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'tk-bg': 'rgb(var(--tk-bg) / <alpha-value>)',
        'tk-surface': 'rgb(var(--tk-surface) / <alpha-value>)',
        'tk-surface-hover': 'rgb(var(--tk-surface-hover) / <alpha-value>)',
        'tk-border': 'rgb(var(--tk-border) / <alpha-value>)',
        'tk-border-subtle': 'rgb(var(--tk-border-subtle) / <alpha-value>)',
        'tk-text-1': 'rgb(var(--tk-text-1) / <alpha-value>)',
        'tk-text-2': 'rgb(var(--tk-text-2) / <alpha-value>)',
        'tk-text-3': 'rgb(var(--tk-text-3) / <alpha-value>)',
        'tk-text-4': 'rgb(var(--tk-text-4) / <alpha-value>)',
        'tk-accent-bg': 'rgb(var(--tk-accent-bg) / <alpha-value>)',
        'tk-accent': 'rgb(var(--tk-accent) / <alpha-value>)',
        'tk-accent-hover': 'rgb(var(--tk-accent-hover) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
