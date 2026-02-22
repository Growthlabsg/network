import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary colour scale (teal) – main brand */
        primary: {
          DEFAULT: '#0F7377',
          50: '#E6F0F0',
          100: '#CCE0E1',
          200: '#99C2C3',
          300: '#66A3A5',
          400: '#338587',
          500: '#0F7377',
          600: '#0C5C5F',
          700: '#094547',
          800: '#062E2F',
          900: '#031718',
        },
        /* Secondary colour scale (amber) – secondary CTAs, highlights, badges */
        secondary: {
          DEFAULT: '#F59E0B',
          50: '#FEF5E7',
          100: '#FDEBD0',
          200: '#FBD7A1',
          300: '#F9C372',
          400: '#F7AF43',
          500: '#F59E0B',
          600: '#C47E09',
          700: '#935F07',
          800: '#623F04',
          900: '#312002',
        },
        /* GrowthLab design tokens */
        growthlab: {
          teal: '#0F7377',
          slate: '#1E293B',
          amber: '#F59E0B',
          light: '#F8FAFC',
          gray: '#334155',
        },
        /* Aliases for existing usage */
        'primary-teal': '#0F7377',
        'teal-light': '#00A884',
        'primary-light': '#00A884',
        slate: '#1E293B',
        muted: '#64748B',
        'muted-dark': '#334155',
        'confetti-gold': '#FFD700',
        'confetti-coral': '#FF6B6B',
        'teal-dark': '#14b8a6',
        'teal-dark-light': '#2dd4bf',
        /* My Network semantic accents */
        'network-growth': '#059669',
        'network-messages': '#7C3AED',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0F7377 0%, #00A884 100%)',
        'brand-gradient-dark': 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
        'logo-gradient': 'linear-gradient(to right, #0F7377, #1E293B)',
      },
      borderRadius: {
        xl: '0.75rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
