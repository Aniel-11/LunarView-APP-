import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

const themes = {
  dark: {
    name: 'Dark',
    colors: {
      background: '#0f1729',
      cardBg: '#1a2540',
      border: '#2a3a6b',
      primary: '#6B7AFF',
      text: '#ffffff',
      textSecondary: '#A5B4FF',
      textTertiary: '#7B8FFF',
    }
  },
  light: {
    name: 'Light',
    colors: {
      background: '#f5f7fa',
      cardBg: '#ffffff',
      border: '#e1e8ed',
      primary: '#4f5fd8',
      text: '#1a1a1a',
      textSecondary: '#4a5568',
      textTertiary: '#718096',
    }
  },
  cosmic: {
    name: 'Cosmic',
    colors: {
      background: '#0a0118',
      cardBg: '#1a0f2e',
      border: '#3d2b5f',
      primary: '#a855f7',
      text: '#ffffff',
      textSecondary: '#c4b5fd',
      textTertiary: '#9333ea',
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [autoTheme, setAutoTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAutoTheme = localStorage.getItem('autoTheme') === 'true';
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setAutoTheme(savedAutoTheme);

    if (savedAutoTheme) {
      applySystemTheme();
    }
  }, []);

  useEffect(() => {
    if (autoTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applySystemTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [autoTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applySystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  };

  const applyTheme = (themeName) => {
    const selectedTheme = themes[themeName];
    const root = document.documentElement;
    
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setAutoTheme(false);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('autoTheme', 'false');
  };

  const toggleAutoTheme = () => {
    const newAutoTheme = !autoTheme;
    setAutoTheme(newAutoTheme);
    localStorage.setItem('autoTheme', String(newAutoTheme));
    
    if (newAutoTheme) {
      applySystemTheme();
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      autoTheme, 
      toggleAutoTheme,
      themes: Object.keys(themes),
      currentTheme: themes[theme]
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}