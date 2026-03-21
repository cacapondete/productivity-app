import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-base': '#080808',
        'dark-surface': '#121212',
        'dark-input': '#1A1A1A',
        'text-primary': '#E0E0E0',
        'text-accent': '#FFFFFF',
      },
      backgroundColor: {
        'base': '#080808',
        'surface': '#121212',
        'input': '#1A1A1A',
      },
      textColor: {
        'primary': '#E0E0E0',
        'accent': '#FFFFFF',
      },
      borderColor: {
        'subtle': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'display': ['var(--font-display)', 'serif'],
        'sans': ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
