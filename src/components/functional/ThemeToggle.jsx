import { useTheme } from '../../context/ThemeContext';
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title="Toggle color theme">{theme === 'light' ? '☾' : '☀'}</button>;
}
