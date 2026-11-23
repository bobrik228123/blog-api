import { ArrowUpRight } from 'lucide-react'

function StoryCard({ post, index, onOpen }) {
  const imageUrl = `https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=900&q=80`
  return (
    <article className={`story-card story-card-${index + 1}`}>
      <button onClick={() => onOpen(post)} className="story-image-link" aria-label={`Read ${post.title}`}>
        <img className="story-image" src={imageUrl} alt="" loading="lazy" />
        <span className="image-arrow"><ArrowUpRight size={18} /></span>
      </button>
      <div className="story-meta"><span>{post.category}</span><span>{post.date}</span></div>
      <h3><button className="story-title-button" onClick={() => onOpen(post)}>{post.title}</button></h3>
      <p className="story-excerpt">{post.content}</p>
      <div className="story-bottom"><span>{post.readTime}</span><span className="story-number">0{index + 1}</span></div>
    </article>
  )
}

export default StoryCard
