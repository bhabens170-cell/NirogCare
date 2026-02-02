import { useAppContext } from '@/context/AppContext';
import { translations, getLanguageCode, Translations, LanguageCode } from '@/i18n/translations';

export function useTranslation() {
  const { selectedLanguage } = useAppContext();
  const langCode: LanguageCode = getLanguageCode(selectedLanguage);
  const t: Translations = translations[langCode] || translations.en;
  
  return { t, langCode, selectedLanguage };
}
