// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ← IMPORTANT : Active le mode sombre par classe
  theme: {
    extend: {
      colors: {
        // Couleurs EBIOS pour dark mode
        ebios: {
          atelier1: { 
            light: '#2563eb', 
            dark: '#60a5fa' 
          },
          atelier2: { 
            light: '#7c3aed', 
            dark: '#a78bfa' 
          },
          atelier3: { 
            light: '#059669', 
            dark: '#34d399' 
          },
          atelier4: { 
            light: '#ea580c', 
            dark: '#fb923c' 
          },
          atelier5: { 
            light: '#dc2626', 
            dark: '#f87171' 
          },
        },
        // Couleurs avec variantes sombres
        functional: {
          info: {
            light: {
              bg: '#dbeafe',
              text: '#1e40af',
              border: '#93c5fd',
            },
            dark: {
              bg: '#1e3a8a',      // Plus foncé pour contraste
              text: '#bfdbfe',    // Plus clair pour lisibilité
              border: '#3b82f6',
            }
          },
          success: {
            light: {
              bg: '#d1fae5',
              text: '#065f46',
              border: '#6ee7b7',
            },
            dark: {
              bg: '#064e3b',
              text: '#a7f3d0',
              border: '#10b981',
            }
          }
        }
      },
    },
  },
  plugins: [],
}

export default config