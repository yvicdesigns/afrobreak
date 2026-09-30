'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import t, { Lang, Translations } from './i18n'

type LanguageContextValue = {
  lang: Lang
  toggle: () => void
  tr: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggle: () => {},
  tr: t.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('afrobreak_lang') as Lang | null
    if (stored === 'en' || stored === 'fr') setLang(stored)
  }, [])

  const toggle = () => {
    setLang(prev => {
      const next: Lang = prev === 'en' ? 'fr' : 'en'
      localStorage.setItem('afrobreak_lang', next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
