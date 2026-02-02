import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface ThemeSettings {
  theme: Theme;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

const THEME_KEY = 'nirogcare_theme';

export function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: 'auto',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(THEME_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (err) {
      console.error('Failed to load theme settings');
    }
  }, []);

  // Detect system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update effective theme based on settings and system theme
  useEffect(() => {
    if (settings.theme === 'auto') {
      setEffectiveTheme(systemTheme);
    } else {
      setEffectiveTheme(settings.theme);
    }
  }, [settings.theme, systemTheme]);

  // Apply theme to document
  useEffect(() => {
    // Apply dark mode class for Tailwind CSS
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
    document.documentElement.setAttribute('data-motion', settings.reducedMotion ? 'reduced' : 'normal');
    document.documentElement.setAttribute('data-font-size', settings.fontSize);

    // Apply reduced motion preference
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    } else {
      document.documentElement.style.removeProperty('--transition-duration');
    }
  }, [effectiveTheme, settings]);

  // Save settings to localStorage whenever they change
  const saveSettings = useCallback((newSettings: ThemeSettings) => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (err) {
      console.error('Failed to save theme settings');
    }
  }, []);

  // Update theme
  const updateTheme = useCallback((theme: Theme) => {
    saveSettings({ ...settings, theme });
  }, [settings, saveSettings]);

  // Update font size
  const updateFontSize = useCallback((fontSize: FontSize) => {
    saveSettings({ ...settings, fontSize });
  }, [settings, saveSettings]);

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    saveSettings({ ...settings, highContrast: !settings.highContrast });
  }, [settings, saveSettings]);

  // Toggle reduced motion
  const toggleReducedMotion = useCallback(() => {
    saveSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  }, [settings, saveSettings]);

  // Toggle screen reader mode
  const toggleScreenReader = useCallback(() => {
    saveSettings({ ...settings, screenReader: !settings.screenReader });
  }, [settings, saveSettings]);

  // Get CSS classes for current theme
  const getThemeClasses = useCallback(() => {
    const classes = [];

    // Theme classes
    classes.push(`theme-${effectiveTheme}`);

    // Font size classes
    classes.push(`font-${settings.fontSize}`);

    // Accessibility classes
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.reducedMotion) classes.push('reduced-motion');
    if (settings.screenReader) classes.push('screen-reader');

    return classes.join(' ');
  }, [effectiveTheme, settings]);

  // Get font size in pixels
  const getFontSize = useCallback(() => {
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    return sizes[settings.fontSize];
  }, [settings.fontSize]);

  // Check if dark mode is active
  const isDarkMode = effectiveTheme === 'dark';

  return {
    settings,
    systemTheme,
    effectiveTheme,
    isDarkMode,
    updateTheme,
    updateFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
    getThemeClasses,
    getFontSize
  };
}
