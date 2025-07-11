/**
 * BandCI Tailwind Configuration for ProspectSync
 * Complete Tailwind CSS configuration with BandCI theme system
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BandCI Primary Brand Colors - Brown palette
        brown: {
          25: '#fdfcfb',
          50: '#faf7f5',
          75: '#f8f4f1',
          100: '#f5ede8',
          200: '#ead9d0',
          300: '#dcc0b0',
          400: '#c89e88',
          500: '#b8806a',
          600: '#a66b56',
          700: '#8d5a49',
          800: '#744c3f',
          900: '#5d4037'
        },
        // Primary colors (same as brown for consistency)
        primary: {
          25: '#fdfcfb',
          50: '#faf7f5',
          75: '#f8f4f1',
          100: '#f5ede8',
          200: '#ead9d0',
          300: '#dcc0b0',
          400: '#c89e88',
          500: '#b8806a',
          600: '#a66b56',
          700: '#8d5a49',
          800: '#744c3f',
          900: '#5d4037'
        },
        // Success colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        // Warning colors
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        // Danger colors
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        // Info colors
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.25' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '2' }],
        '3xl': ['1.875rem', { lineHeight: '2.25' }],
        '4xl': ['2.25rem', { lineHeight: '2.5' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px'
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(93, 64, 55, 0.05)',
        'md': '0 4px 6px -1px rgba(93, 64, 55, 0.1), 0 2px 4px -1px rgba(93, 64, 55, 0.06)',
        'lg': '0 10px 15px -3px rgba(93, 64, 55, 0.1), 0 4px 6px -2px rgba(93, 64, 55, 0.05)',
        'xl': '0 20px 25px -5px rgba(93, 64, 55, 0.1), 0 10px 10px -5px rgba(93, 64, 55, 0.04)',
        '2xl': '0 25px 50px -12px rgba(93, 64, 55, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(93, 64, 55, 0.06)',
        'none': 'none'
      },
      animation: {
        'flash': 'flash 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out'
      },
      keyframes: {
        flash: {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0.5' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  plugins: [
    // Form styling plugin
    function({ addUtilities }) {
      addUtilities({
        '.prospect-btn': {
          '@apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed': {}
        },
        '.prospect-btn-primary': {
          '@apply bg-brown-900 text-white hover:bg-brown-800 focus:ring-brown-700': {}
        },
        '.prospect-btn-secondary': {
          '@apply bg-brown-100 text-brown-900 border-brown-200 hover:bg-brown-75 focus:ring-brown-700': {}
        },
        '.prospect-btn-outline': {
          '@apply bg-transparent text-brown-900 border-brown-900 hover:bg-brown-100 focus:ring-brown-700': {}
        },
        '.prospect-card': {
          '@apply bg-white border border-brown-100 rounded-lg shadow-md overflow-hidden': {}
        },
        '.prospect-input': {
          '@apply w-full px-3 py-2 border border-brown-200 rounded-md bg-white text-gray-900 placeholder-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-700 focus:border-brown-700 disabled:bg-brown-100 disabled:cursor-not-allowed': {}
        },
        '.prospect-select': {
          '@apply w-full px-3 py-2 border border-brown-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brown-700 focus:border-brown-700 disabled:bg-brown-100 disabled:cursor-not-allowed': {}
        },
        '.prospect-table': {
          '@apply w-full bg-white border-collapse rounded-lg overflow-hidden shadow-sm': {}
        },
        '.prospect-table th': {
          '@apply bg-brown-900 text-white px-4 py-3 text-left font-semibold text-sm uppercase tracking-wider': {}
        },
        '.prospect-table td': {
          '@apply px-4 py-3 border-t border-brown-100 text-gray-900': {}
        },
        '.prospect-table tr:hover': {
          '@apply bg-brown-50': {}
        },
        '.status-clean': {
          '@apply inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brown-300 text-brown-900': {}
        },
        '.status-complete': {
          '@apply inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brown-400 text-brown-900': {}
        },
        '.status-working': {
          '@apply inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brown-500 text-white': {}
        },
        '.status-highlight': {
          '@apply inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brown-700 text-white': {}
        }
      })
    }
  ]
}