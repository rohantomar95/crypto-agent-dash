
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        crypto: {
          'purple': '#9b87f5', // Primary Purple
          'purple-medium': '#7E69AB', // Secondary Purple
          'purple-dark': '#6E59A5', // Tertiary Purple
          'blue-dark': '#0EA5E9', // Ocean Blue
          'blue-light': '#33C3F0', // Sky Blue
          'orange': '#F97316',
          'green': '#10B981',
          'red': '#EF4444',
          'gray-dark': '#131624',
          'gray-light': '#1e293b',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'pulse-glow': {
          '0%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.4' }
        },
        'pulse-once': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        },
        'hexagon-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'crypto-pulse': {
          '0%, 100%': { 
            borderColor: 'rgba(155, 135, 245, 0.3)' 
          },
          '50%': { 
            borderColor: 'rgba(155, 135, 245, 0.8)' 
          }
        },
        'race-move': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(var(--race-progress))' }
        },
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        },
        'candle-appear': {
          from: { opacity: '0', transform: 'scaleY(0.5)' },
          to: { opacity: '1', transform: 'scaleY(1)' }
        },
        'marker-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'smooth-slide': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(var(--slide-y))' }
        },
        'smooth-value-change': {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        'trade-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }
        },
        'smooth-move': {
          '0%': { transform: 'translateY(var(--from-y))' },
          '100%': { transform: 'translateY(var(--to-y))' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-once': 'pulse-once 0.5s ease-out',
        'hexagon-rotate': 'hexagon-rotate 8s linear infinite',
        'crypto-pulse': 'crypto-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'race-move': 'race-move 1s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'candle-appear': 'candle-appear 0.3s ease-out forwards',
        'marker-pulse': 'marker-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'smooth-slide': 'smooth-slide 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'smooth-value-change': 'smooth-value-change 0.7s ease-out forwards',
        'trade-pulse': 'trade-pulse 1s ease-out forwards',
        'smooth-move': 'smooth-move 1s cubic-bezier(0.22, 1, 0.36, 1) forwards'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, #232631 1px, transparent 1px), linear-gradient(to bottom, #232631 1px, transparent 1px)'
      },
      transitionTimingFunction: {
        'bounce-in-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
