import { ArrowDownRight } from 'lucide-react'

function Hero({ onWrite }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-mark" /> The open notebook <span className="eyebrow-dot">·</span> Est. 2024</p>
        <h1>Ideas worth<br /><em>passing around.</em></h1>
        <p className="hero-description">Notes on craft, code, and the spaces between.</p>
        <div className="hero-actions"><a className="scroll-cue" href="#stories">Explore the stories <ArrowDownRight size={17} /></a><button className="hero-write" onClick={onWrite}>Share an idea ↗</button></div>
      </div>
      <div className="hero-art" role="img" aria-label="A sunlit desk with a notebook and blue lamp">
        <div className="art-sticker">MAKE<br />A LITTLE<br />ROOM <span>✳</span></div>
        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1500&q=85" alt="An open notebook on a warm wooden desk" />
        <div className="art-caption">A PLACE TO BEGIN AGAIN <span>↗</span></div>
      </div>
      <div className="hero-index">01 <span /> 03</div>
    </section>
  )
}

export default Hero
