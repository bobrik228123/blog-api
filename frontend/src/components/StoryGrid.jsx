import { ArrowRight } from 'lucide-react'
import StoryCard from './StoryCard.jsx'

function StoryGrid({ posts, loading, apiAvailable, error, onOpen, onBrowse, onLoadMore, hasMore }) {
  return (
    <section className="stories-section" id="stories">
      <div className="section-heading">
        <div><p className="eyebrow section-kicker">Read, wander, return</p><h2>Latest stories<span className="heading-period">.</span></h2></div>
        <button onClick={onBrowse} className="browse-link">Browse all <ArrowRight size={17} /></button>
      </div>
      {!apiAvailable && <p className="api-note">The blog API could not be reached: {error || 'check that the backend is running.'}</p>}
      {loading && <p className="api-note">Looking for the latest stories…</p>}
      {!loading && apiAvailable && posts.length === 0 && <p className="api-note">No stories found yet. Be the first to write one.</p>}
      <div className="story-grid">{posts.map((post, index) => <StoryCard key={post.id} post={post} index={index} onOpen={onOpen} />)}</div>
      {hasMore && <button className="button-secondary load-more" onClick={onLoadMore} disabled={loading}>{loading ? 'Loading…' : 'Load more stories'}</button>}
      <div className="archive-row"><span>Good ideas take the long way around.</span><button onClick={onBrowse}>Visit the archive <ArrowRight size={15} /></button></div>
    </section>
  )
}

export default StoryGrid
