import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { vi } from './locales/vi'

export const STORAGE_KEY = 'tinygoal-lang'

export type AppLanguage = 'en' | 'vi'

function readSavedLanguage(): AppLanguage | null {
  if (typeof localStorage === 'undefined') return null
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'vi') return saved
  return null
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: readSavedLanguage() ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLanguage(lng: AppLanguage): void {
  void i18n.changeLanguage(lng)
  localStorage.setItem(STORAGE_KEY, lng)
}

export default i18n
