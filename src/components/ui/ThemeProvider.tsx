import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  settings: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  isDarkMode: boolean;
  updateTheme: (theme: 'light' | 'dark' | 'auto') => void;
  updateFontSize: (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
  getThemeClasses: () => string;
  getFontSize: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTheme();

  const contextValue: ThemeContextType = {
    settings: theme.settings,
    isDarkMode: theme.isDarkMode,
    updateTheme: theme.updateTheme,
    updateFontSize: theme.updateFontSize,
    toggleHighContrast: theme.toggleHighContrast,
    toggleReducedMotion: theme.toggleReducedMotion,
    toggleScreenReader: theme.toggleScreenReader,
    getThemeClasses: theme.getThemeClasses,
    getFontSize: theme.getFontSize
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={theme.getThemeClasses()}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
