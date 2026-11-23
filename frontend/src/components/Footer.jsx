function Footer({ onNavigate }) {
  return (
    <footer className="site-footer" id="about">
      <button className="footer-brand" onClick={() => onNavigate('home')}>FIELDNOTES<span>®</span></button>
      <p>Made slowly, shared freely.<br />A little corner of the internet.</p>
      <div className="footer-right"><span>New York · Everywhere</span><span>© 2025 FIELDNOTES</span></div>
    </footer>
  )
}

export default Footer
