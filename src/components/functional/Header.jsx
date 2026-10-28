import ThemeToggle from './ThemeToggle';
export default function Header() {
  return <header className="topbar"><a className="brand" href="#"><span className="brand-mark">✓</span>TaskFlow<span className="workspace-label">Personal workspace</span></a><div className="header-actions"><span className="local-badge"><i/> Saved on this device</span><ThemeToggle/><span className="avatar" title="Personal workspace">SF</span></div></header>;
}
