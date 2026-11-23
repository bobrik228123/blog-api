import { ArrowUpRight } from 'lucide-react'

import { useState } from 'react'

function Header({ onNavigate, loggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = view => { onNavigate(view); setMenuOpen(false) }
  return (
    <header className="site-header">
      <button className="brand brand-button" onClick={() => go('home')} aria-label="Fieldnotes home">
        <span className="brand-name">FIELDNOTES</span>
        <span className="brand-tagline">A BLOG ABOUT MAKING THINGS</span>
      </button>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        <button onClick={() => go('home')}>Stories</button>
        <button onClick={() => { go('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 0) }}>About</button>
        {loggedIn ? <button onClick={onLogout}>Log out</button> : <button onClick={() => go('login')}>Log in</button>}
        <button className="write-link" onClick={() => go(loggedIn ? 'write' : 'login')}>{loggedIn ? 'Write a post' : 'Join to write'} <ArrowUpRight size={15} strokeWidth={2} /></button>
      </nav>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
  )
}

export default Header
