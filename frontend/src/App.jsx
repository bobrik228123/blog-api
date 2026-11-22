import { useCallback, useEffect, useState } from 'react'
import StoryCard from './components/StoryCard.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import StoryGrid from './components/StoryGrid.jsx'
import Footer from './components/Footer.jsx'
import { getPosts, getPost, createPost, updatePost, deletePost, login, register, getCurrentUser, getComments, createComment, getLikes, getMyLikeStatus, addLike, removeLike } from './api/blog.js'

const art = ['photo-1494438639946-1ebd1d20bf85', 'photo-1455390582262-044cdead277a', 'photo-1487958449943-2429e8be8625']
const PAGE_SIZE = 3

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [token, setToken] = useState(() => localStorage.getItem('fieldnotes_token') || '')
  const [currentUser, setCurrentUser] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = useCallback(async ({ append = false } = {}) => {
    setLoading(true); setApiError('')
    const skip = append ? posts.length : 0
    try {
      const page = await getPosts({ skip, limit: PAGE_SIZE, search: query, sort })
      setPosts(current => append ? [...current, ...page] : page)
      setHasMore(page.length === PAGE_SIZE)
    }
    catch (error) { setApiError(error.message || 'Could not reach the blog API.') }
    finally { setLoading(false) }
  }, [query, sort, posts.length])

  useEffect(() => { loadPosts(); }, [query, sort])

  useEffect(() => {
    if (!token) { setCurrentUser(null); return }
    getCurrentUser(token).then(setCurrentUser).catch(() => {
      localStorage.removeItem('fieldnotes_token')
      setToken('')
      setCurrentUser(null)
      setMessage('Your session expired. Please log in again.')
    })
  }, [token])

  const openPost = async (post) => {
    if (!Number.isInteger(Number(post.id))) return
    setBusy(true); setMessage('')
    try {
      const [detail, commentRows, likeCount, likeStatus] = await Promise.all([
        getPost(post.id), getComments(post.id), getLikes(post.id),
        token ? getMyLikeStatus(post.id, token) : Promise.resolve({ liked: false }),
      ])
      setSelected(detail); setComments(commentRows); setLikes(likeCount); setLiked(likeStatus.liked); setView('detail'); window.scrollTo(0, 0)
    } catch (error) { setMessage(error.message || 'Could not load this story.') }
    finally { setBusy(false) }
  }

  const handleLogin = async (form) => {
    setBusy(true); setMessage('')
    try { const result = await login(form.email, form.password); localStorage.setItem('fieldnotes_token', result.access_token); setToken(result.access_token); setView('home'); setMessage('You’re logged in.'); }
    catch (error) { setMessage(error.message || 'Login failed.') }
    finally { setBusy(false) }
  }

  const handleRegister = async (form) => {
    setBusy(true); setMessage('')
    try { await register(form.email, form.password); await handleLogin(form) }
    catch (error) { setMessage(error.message || 'Registration failed.') }
    finally { setBusy(false) }
  }

  const handleSavePost = async ({ title, content, id }) => {
    setBusy(true); setMessage('')
    try {
      const saved = id ? await updatePost(id, { title, content }, token) : await createPost({ title, content }, token)
      await loadPosts(); setSelected(saved); setView('detail'); setMessage(id ? 'Story updated.' : 'Story published.')
    } catch (error) { setMessage(error.message || 'Could not save the story.') }
    finally { setBusy(false) }
  }

  const handleDeletePost = async () => {
    if (!selected || !window.confirm('Delete this story? This cannot be undone.')) return
    setBusy(true)
    try { await deletePost(selected.id, token); setSelected(null); setView('home'); await loadPosts(); setMessage('Story deleted.') }
    catch (error) { setMessage(error.message || 'Could not delete the story.') }
    finally { setBusy(false) }
  }

  const handleComment = async (content) => {
    if (!selected) return
    setBusy(true)
    try { await createComment(selected.id, content, token); setComments(await getComments(selected.id)); setMessage('Comment added.') }
    catch (error) { setMessage(error.message || 'Could not add comment.') }
    finally { setBusy(false) }
  }

  const handleLike = async () => {
    if (!selected) return
    if (!token) { setMessage('Log in to like a story.'); return }
    setBusy(true)
    try {
      if (liked) await removeLike(selected.id, token)
      else await addLike(selected.id, token)
      setLiked(!liked)
      setLikes(await getLikes(selected.id))
    }
    catch (error) { setMessage(error.message || 'Could not like this story.') }
    finally { setBusy(false) }
  }

  const logout = () => { localStorage.removeItem('fieldnotes_token'); setToken(''); setCurrentUser(null); setMessage('You’re logged out.') }
  const navigate = (next) => { setMessage(''); setView(next); if (!['detail', 'write'].includes(next)) setSelected(null); window.scrollTo(0, 0) }

  return <div className="site-shell">
    <Header onNavigate={navigate} loggedIn={Boolean(token)} onLogout={logout} />
    {message && <div className="toast" role="status"><span>{message}</span><button onClick={() => setMessage('')} aria-label="Dismiss">×</button></div>}
    <main>
      {view === 'home' && <><Hero onWrite={() => navigate(token ? 'write' : 'login')} /><StoryGrid posts={posts.map((post, i) => ({ ...post, category: 'Story', date: 'From the notebook', readTime: 'Read story', image: art[i % art.length] }))} loading={loading} apiAvailable={!apiError} error={apiError} onOpen={openPost} onBrowse={() => navigate('archive')} onLoadMore={() => loadPosts({append:true})} hasMore={hasMore} /><div className="create-cta"><span>Have a thought worth passing around?</span><button className="button-primary" onClick={() => navigate(token ? 'write' : 'login')}>Write a story ↗</button></div></>}
      {view === 'archive' && <section className="content-view"><button className="back-link" onClick={() => navigate('home')}>← Back home</button><p className="eyebrow">The complete collection</p><h1 className="view-title">Story archive<span className="heading-period">.</span></h1><section className="archive-tools"><label className="search-box">Search<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Title or keyword" /></label><label className="sort-box">Order<select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></section>{apiError && <p className="form-error">{apiError}</p>}{loading && posts.length===0 ? <p>Loading stories…</p> : <div className="story-grid">{posts.map((p,i)=><StoryCard key={p.id} post={{...p,image:art[i%3],category:'Story',date:'From the notebook',readTime:'Read story'}} index={i} onOpen={openPost}/>)}</div>}{hasMore && <button className="button-secondary load-more" onClick={() => loadPosts({append:true})} disabled={loading}>{loading?'Loading…':'Load more stories'}</button>}</section>}
      {view === 'detail' && selected && <section className="content-view detail-view"><button className="back-link" onClick={() => navigate('home')}>← Back to stories</button><p className="eyebrow">Fieldnotes · Story {selected.id}</p><h1 className="detail-title">{selected.title}</h1><p className="detail-byline">A story from the open notebook · Post #{selected.id}</p><div className="detail-body">{selected.content}</div><div className="detail-actions"><button className="button-secondary" onClick={handleLike} disabled={busy}>{liked?'♥ Unlike':'♡ Like'} · {likes}</button>{currentUser?.id === selected.user_id && <button className="button-secondary" onClick={() => {setView('write')}}>Edit story</button>}{currentUser?.id === selected.user_id && <button className="button-danger" onClick={handleDeletePost} disabled={busy}>Delete story</button>}</div><section className="comments"><h2>Notes from readers <span>({comments.length})</span></h2>{token ? <CommentForm onSubmit={handleComment} busy={busy}/> : <p className="api-note">Log in to leave a comment.</p>}{comments.map((comment,i)=><article className="comment-item" key={`${comment.post_id}-${comment.user_id}-${i}`}><p>{comment.content}</p><small>Reader #{comment.user_id}</small></article>)}</section></section>}
      {view === 'login' && <AuthPanel mode="login" busy={busy} onSubmit={handleLogin} onSwitch={() => navigate('register')} />}
      {view === 'register' && <AuthPanel mode="register" busy={busy} onSubmit={handleRegister} onSwitch={() => navigate('login')} />}
      {view === 'write' && <PostForm busy={busy} post={selected} onSubmit={handleSavePost} onCancel={() => selected ? navigate('detail') : navigate('home')} />}
    </main>
    <Footer onNavigate={navigate} />
  </div>
}

function AuthPanel({ mode, busy, onSubmit, onSwitch }) {
  const registerMode = mode === 'register'
  return <section className="content-view form-view"><p className="eyebrow">Welcome to the notebook</p><h1 className="view-title">{registerMode ? 'Make an account' : 'Good to have you back'}<span className="heading-period">.</span></h1><p className="form-intro">{registerMode ? 'Create an account to write, comment, and join the conversation.' : 'Log in to write stories and leave a note.'}</p><form className="editor-form" onSubmit={e=>{e.preventDefault();onSubmit({email:e.target.email.value,password:e.target.password.value})}}><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Password<input name="password" type="password" required minLength="8" autoComplete={registerMode?'new-password':'current-password'} /></label><button className="button-primary" disabled={busy}>{busy?'Please wait…':registerMode?'Create account':'Log in'}</button></form><p className="switch-auth">{registerMode?'Already have an account?':'New here?'} <button onClick={onSwitch}>{registerMode?'Log in':'Create an account'}</button></p><p className="api-note">Sign in uses your blog account. Passwords are sent only to your API over the local connection.</p></section>
}

function PostForm({ busy, post, onSubmit, onCancel }) {
  return <section className="content-view form-view"><button className="back-link" onClick={onCancel}>← Cancel</button><p className="eyebrow">The open notebook</p><h1 className="view-title">{post?'Edit your story':'Write a story'}<span className="heading-period">.</span></h1><form className="editor-form" onSubmit={e=>{e.preventDefault();onSubmit({id:post?.id,title:e.target.title.value,content:e.target.content.value})}}><label>Title<input name="title" required maxLength="180" defaultValue={post?.title||''} placeholder="Give your story a title" /></label><label>Your story<textarea name="content" required rows="12" defaultValue={post?.content||''} placeholder="Start with what you can’t stop thinking about…" /></label><div className="form-actions"><button className="button-primary" disabled={busy}>{busy?'Saving…':post?'Save changes':'Publish story'}</button><button type="button" className="button-secondary" onClick={onCancel}>Cancel</button></div></form></section>
}

function CommentForm({ onSubmit, busy }) { return <form className="comment-form" onSubmit={e=>{e.preventDefault();const value=e.target.content.value.trim();if(value){onSubmit(value);e.target.reset()}}}><textarea name="content" placeholder="Leave a thoughtful note…" required rows="3"/><button className="button-primary" disabled={busy}>Post comment</button></form> }
export default App
