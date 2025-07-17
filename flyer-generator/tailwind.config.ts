import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        petrol: '#00809D',
        black: '#2B2926',
        gray400: '#AFAAA5',
        white: '#FFFFFF',
        gray50: '#F7F5F3',
        success: '#038400',
        gray800: '#45423E',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xl': ['24px', '32px'],
        base: ['16px', '24px'],
        xs: ['12px', '16px'],
        flyerTitle: ['48px', '50px'],
        flyerSub: ['18px', '20px'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config; 