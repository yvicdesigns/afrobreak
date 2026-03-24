'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import clsx from 'clsx'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
  autoFocus?: boolean
  variant?: 'default' | 'expanded' | 'hero'
}

export default function SearchBar({
  placeholder = 'Search videos, events...',
  value: externalValue,
  onChange,
  onSubmit,
  className,
  autoFocus = false,
  variant = 'default',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const value = externalValue !== undefined ? externalValue : internalValue

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (externalValue === undefined) setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    if (externalValue === undefined) setInternalValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={clsx('relative w-full max-w-2xl', className)}>
        <div
          className={clsx(
            'flex items-center',
            'bg-white/10 backdrop-blur-md',
            'border rounded-2xl',
            'transition-all duration-300',
            isFocused
              ? 'border-primary-500 shadow-[0_0_30px_rgba(249,115,22,0.2)]'
              : 'border-white/20'
          )}
        >
          <Search
            size={20}
            className={clsx(
              'ml-5 flex-shrink-0 transition-colors duration-200',
              isFocused ? 'text-primary-500' : 'text-text-secondary'
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={clsx(
              'flex-1 bg-transparent px-4 py-4',
              'text-white placeholder-text-muted',
              'text-base focus:outline-none'
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="mr-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all duration-200 text-sm"
          >
            Search
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)}>
      <div
        className={clsx(
          'flex items-center',
          'bg-surface-2 border rounded-xl',
          'transition-all duration-200',
          isFocused
            ? 'border-primary-500/60 shadow-[0_0_0_3px_rgba(249,115,22,0.1)]'
            : 'border-white/10'
        )}
      >
        <Search
          size={16}
          className={clsx(
            'ml-3 flex-shrink-0 transition-colors',
            isFocused ? 'text-primary-500' : 'text-text-secondary'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 p-1 rounded text-text-secondary hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  )
}
