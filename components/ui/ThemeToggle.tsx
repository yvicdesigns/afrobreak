'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-300 ${className ?? ''}`}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: theme === 'dark' ? 1 : 0, transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)' }}
      >
        <Sun size={18} />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: theme === 'light' ? 1 : 0, transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)' }}
      >
        <Moon size={18} />
      </span>
      <span className="opacity-0 pointer-events-none"><Sun size={18} /></span>
    </button>
  )
}
