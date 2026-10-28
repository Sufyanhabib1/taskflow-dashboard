import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('taskflow-theme', 'light', v => ['light','dark'].includes(v));
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
