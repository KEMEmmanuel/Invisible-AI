import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#050a10',
          dark: '#0a192f',
          blue: '#00f2ff',
          cyan: '#00ffff',
          neon: '#00d4ff',
          border: 'rgba(0, 242, 255, 0.2)',
          'border-bright': 'rgba(0, 242, 255, 0.5)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#00f2ff',
          foreground: '#050a10',
        },
        secondary: {
          DEFAULT: '#0a192f',
          foreground: '#00f2ff',
        },
        muted: {
          DEFAULT: 'rgba(0, 242, 255, 0.1)',
          foreground: 'rgba(0, 242, 255, 0.7)',
        },
        accent: {
          DEFAULT: '#00ffff',
          foreground: '#050a10',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(180deg, rgba(10, 25, 47, 0.8) 0%, rgba(5, 10, 16, 0.95) 100%)',
        'neon-glow': 'radial-gradient(circle at center, rgba(0, 242, 255, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 242, 255, 0.3), 0 0 20px rgba(0, 242, 255, 0.1)',
        'neon-bright': '0 0 15px rgba(0, 242, 255, 0.5), 0 0 30px rgba(0, 242, 255, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
