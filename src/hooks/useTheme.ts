import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('am_theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Application strictly locked in dark mode
  };

  return { theme: 'dark' as const, toggleTheme, isDark: true };
}
