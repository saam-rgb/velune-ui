import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../store/slices/authSlice';
import { createArticle, updateArticle, deleteArticle, fetchArticles, selectArticles } from '../store/slices/articlesSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import RichTextEditor from '../components/ui/RichTextEditor';

const CATEGORIES = ['Tech', 'Fashion', 'Health', 'Lifestyle', 'Grooming'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EMPTY_DRAFT = {
  title: '',
  category: 'Tech',
  excerpt: '',
  body: '',
  featured: false,
  tags: '',
  coverImageFile: null,
  coverImage: '',
};

// ── Delete confirmation dialog ──────────────────────────────────────────────
function DeleteDialog({ title, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="p-8 max-w-[420px] w-full mx-4" style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
        <h3 className="font-editorial text-[20px] font-semibold v-text m-0 mb-3">Delete Article?</h3>
        <p className="font-sans text-[14px] v-muted mb-6 leading-relaxed">
          "<span className="v-text">{title}</span>" will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 font-sans text-[11px] tracking-[0.18em] uppercase font-semibold cursor-pointer"
            style={{
              background: '#c0392b',
              color: '#fff',
              border: 'none',
              padding: '13px 20px',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.18s',
            }}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const colors = {
    PUBLISHED: { bg: 'rgba(39,174,96,0.12)', color: '#27ae60' },
    DRAFT:     { bg: 'rgba(142,138,131,0.12)', color: 'var(--velune-muted)' },
    ARCHIVED:  { bg: 'rgba(192,57,43,0.12)',  color: '#c0392b' },
  };
  const s = colors[status] || colors.DRAFT;
  return (
    <span
      className="font-sans text-[10px] tracking-[0.12em] uppercase font-semibold px-2 py-1"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector(selectUser);
  const allPosts  = useSelector(selectArticles);

  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('overview');  // 'overview' | 'posts'

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId]   = useState(null);      // null = new article
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draft, setDraft]           = useState(EMPTY_DRAFT);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);  // { id, title }
  const [deleting, setDeleting]         = useState(false);

  // Posts tab pagination
  const [postsPage, setPostsPage]   = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  const POSTS_LIMIT = 15;

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'posts') loadPosts(postsPage);
  }, [activeTab, postsPage]);

  async function loadPosts(page) {
    setPostsLoading(true);
    try {
      const result = await dispatch(fetchArticles({ limit: POSTS_LIMIT, page, status: 'ALL' })).unwrap();
      setPostsTotal(result.total);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }

  function set(field) {
    return val => setDraft(d => ({ ...d, [field]: val }));
  }

  async function uploadCover() {
    if (!draft.coverImageFile) return draft.coverImage || undefined;
    const fd = new FormData();
    fd.append('image', draft.coverImageFile);
    const { data } = await api.post('/upload/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  }

  function openNewEditor() {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setShowEditor(true);
  }

  function openEditEditor(article) {
    setDraft({
      title:          article.title || '',
      category:       article.category || 'Tech',
      excerpt:        article.excerpt || '',
      body:           typeof article.body === 'string' ? article.body : (article.body || []).join('\n'),
      featured:       article.featured ?? false,
      tags:           (article.tags || []).join(', '),
      coverImageFile: null,
      coverImage:     article.coverImage || '',
    });
    setEditingId(article.id);
    setShowEditor(true);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  async function handlePublish() {
    if (!draft.title.trim()) { toast.error('Title is required'); return; }
    if (!draft.body || draft.body === '<p></p>') { toast.error('Body cannot be empty'); return; }
    setPublishing(true);
    try {
      const coverImage = await uploadCover();
      const payload = {
        title:    draft.title,
        excerpt:  draft.excerpt,
        body:     draft.body,
        category: draft.category,
        featured: draft.featured,
        tags:     draft.tags.split(',').map(t => t.trim()).filter(Boolean),
        coverImage,
        status:   'PUBLISHED',
      };

      if (editingId) {
        await dispatch(updateArticle({ id: editingId, ...payload })).unwrap();
        toast.success('Article updated!');
      } else {
        await dispatch(createArticle(payload)).unwrap();
        toast.success('Article published!');
      }

      closeEditor();
      dispatch(fetchArticles({ limit: POSTS_LIMIT, page: postsPage, status: 'ALL' }));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  async function handleSaveDraft() {
    if (!draft.title.trim()) { toast.error('Title is required to save'); return; }
    setSavingDraft(true);
    try {
      const coverImage = await uploadCover();
      const payload = {
        title:    draft.title,
        excerpt:  draft.excerpt,
        body:     draft.body,
        category: draft.category,
        featured: draft.featured,
        tags:     draft.tags.split(',').map(t => t.trim()).filter(Boolean),
        coverImage,
        status:   'DRAFT',
      };

      if (editingId) {
        await dispatch(updateArticle({ id: editingId, ...payload })).unwrap();
        toast.success('Draft updated');
      } else {
        await dispatch(createArticle(payload)).unwrap();
        toast.success('Draft saved');
      }

      closeEditor();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to save draft');
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteArticle(deleteTarget.id)).unwrap();
      toast.success('Article deleted');
      setDeleteTarget(null);
      // refresh stats badge count
      api.get('/analytics/dashboard').then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate('/');
  }

  const maxTraffic = stats ? Math.max(...(stats.weeklyTraffic || [1])) : 1;
  const totalPostPages = Math.ceil(postsTotal / POSTS_LIMIT);

  return (
    <>
      <Helmet><title>Dashboard — Velune</title></Helmet>

      <div className="min-h-screen" style={{ background: 'var(--velune-bg)' }}>
        {/* ── Dashboard Nav ── */}
        <div
          className="flex items-center justify-between px-10 h-16 sticky top-0 z-[100]"
          style={{ background: 'var(--velune-bg)', borderBottom: '1px solid var(--velune-border)' }}
        >
          <button onClick={() => navigate('/')} className="border-none bg-transparent cursor-pointer p-0">
            <span className="font-editorial text-[18px] font-bold tracking-[0.35em] v-text uppercase">VELUNE</span>
          </button>
          <span className="label-caps v-muted hidden sm:block">Editorial Dashboard</span>
          <div className="flex gap-4 items-center">
            <button onClick={() => navigate('/')} className="font-sans text-[12px] v-muted bg-transparent border-none cursor-pointer">
              View Site
            </button>
            <button onClick={handleLogout} className="btn-nav">Sign Out</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex gap-0 px-10"
          style={{ borderBottom: '1px solid var(--velune-border)', background: 'var(--velune-surface)' }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'posts',    label: 'All Posts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-sans text-[11px] tracking-[0.14em] uppercase font-medium bg-transparent border-none cursor-pointer py-4 px-6 transition-colors"
              style={{
                color: activeTab === tab.id ? 'var(--velune-accent)' : 'var(--velune-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--velune-accent)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-0">
            <button className="btn-primary" style={{ fontSize: 11, padding: '8px 20px' }} onClick={openNewEditor}>
              + New Article
            </button>
          </div>
        </div>

        <div className="container-velune pt-10 pb-20">
          {loading && activeTab === 'overview' ? (
            <div className="flex justify-center py-20"><Spinner size={32} /></div>
          ) : activeTab === 'overview' ? (
            <>
              {/* ── Stat cards ── */}
              {stats && (
                <div className="grid gap-5 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  {[
                    { label: 'Total Views', value: stats.totalViews?.toLocaleString() || '—', sub: 'All time' },
                    { label: 'This Month',  value: stats.monthViews?.toLocaleString()  || '—', sub: 'Page views', accent: true },
                    { label: 'Subscribers', value: stats.subscribers?.toLocaleString() || '—', sub: 'Newsletter list' },
                    { label: 'Articles',    value: stats.articles || '—',                       sub: 'Published' },
                  ].map(({ label, value, sub, accent }) => (
                    <div key={label} className="p-[28px_28px_24px]" style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
                      <div className="label-caps v-muted mb-[14px]">{label}</div>
                      <div className="font-editorial text-[34px] font-bold v-text mb-2">{value}</div>
                      <div className={`font-sans text-[12px] ${accent ? 'text-green-400' : 'v-muted'}`}>{sub}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: '1fr 380px' }}>
                {/* ── Traffic chart ── */}
                {stats?.weeklyTraffic && (
                  <div className="p-[32px_32px_28px]" style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
                    <div className="flex justify-between items-baseline mb-8">
                      <h3 className="font-editorial text-[20px] font-semibold v-text m-0">Weekly Traffic</h3>
                      <span className="font-sans text-[11px] v-muted">Page views</span>
                    </div>
                    <svg viewBox="0 0 580 150" width="100%" style={{ overflow: 'visible' }}>
                      {stats.weeklyTraffic.map((val, i) => {
                        const barW = 52, gap = 30;
                        const bh = Math.max(4, Math.round((val / maxTraffic) * 100));
                        const x = i * (barW + gap);
                        const y = 120 - bh;
                        const isMax = val === maxTraffic;
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={barW} height={bh} fill={isMax ? 'var(--velune-accent)' : 'var(--velune-border)'} rx="3" />
                            <text x={x + barW / 2} y={138} textAnchor="middle" fontSize="11" fill="var(--velune-muted)" fontFamily="Inter,sans-serif">{DAYS[i]}</text>
                            {isMax && <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="11" fill="var(--velune-accent)" fontFamily="Inter,sans-serif">{val}</text>}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}

                {/* ── Quick actions ── */}
                <div className="p-[32px_28px] flex flex-col gap-4" style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
                  <h3 className="font-editorial text-[20px] font-semibold v-text m-0 mb-2">Quick Actions</h3>
                  <button className="btn-primary w-full" onClick={openNewEditor}>+ New Article</button>
                  <button className="btn-secondary w-full" onClick={() => setActiveTab('posts')}>Manage Posts</button>
                  <button className="btn-secondary w-full" onClick={() => navigate('/')}>Preview Site</button>
                  <div className="pt-4 mt-2" style={{ borderTop: '1px solid var(--velune-border)' }}>
                    <div className="label-caps v-muted mb-3">Newsletter</div>
                    <div className="font-editorial text-[28px] font-bold v-text">{stats?.subscribers?.toLocaleString() || '—'}</div>
                    <div className="font-sans text-[12px] v-muted mt-1">Active subscribers</div>
                  </div>
                </div>
              </div>

              {/* ── Top posts (overview only) ── */}
              {stats?.topPosts?.length > 0 && (
                <div style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
                  <div className="flex justify-between items-center px-8 py-6" style={{ borderBottom: '1px solid var(--velune-border)' }}>
                    <h3 className="font-editorial text-[20px] font-semibold v-text m-0">Top Performing Articles</h3>
                    <button
                      onClick={() => setActiveTab('posts')}
                      className="font-sans text-[11px] v-accent bg-transparent border-none cursor-pointer tracking-[0.1em] uppercase"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--velune-border)' }}>
                          {['Article', 'Category', 'Views', 'Actions'].map(h => (
                            <th key={h} className="label-caps v-muted px-8 py-[14px] text-left font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topPosts.map((post, i) => (
                          <tr
                            key={post.id}
                            style={{ borderBottom: i < stats.topPosts.length - 1 ? '1px solid var(--velune-border)' : 'none' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--velune-surface)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td className="font-editorial text-[15px] v-text px-8 py-[18px]" style={{ maxWidth: 360 }}>{post.title}</td>
                            <td className="label-caps v-accent px-8 py-[18px] whitespace-nowrap">{post.category}</td>
                            <td className="font-sans text-[14px] font-medium v-text px-8 py-[18px] whitespace-nowrap">{post.views?.toLocaleString()}</td>
                            <td className="px-8 py-[18px]">
                              <PostActions
                                post={post}
                                onView={() => navigate(`/article/${post.slug}`)}
                                onEdit={() => openEditEditor(post)}
                                onDelete={() => setDeleteTarget({ id: post.id, title: post.title })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── All Posts tab ── */
            <div style={{ background: 'var(--velune-card)', border: '1px solid var(--velune-border)' }}>
              <div className="flex justify-between items-center px-8 py-6" style={{ borderBottom: '1px solid var(--velune-border)' }}>
                <h3 className="font-editorial text-[20px] font-semibold v-text m-0">All Articles</h3>
                <button className="btn-primary" style={{ fontSize: 11, padding: '8px 20px' }} onClick={openNewEditor}>
                  + New Article
                </button>
              </div>

              {postsLoading ? (
                <div className="flex justify-center py-16"><Spinner size={28} /></div>
              ) : allPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-editorial text-[18px] v-muted">No articles yet.</p>
                  <button className="btn-primary mt-4" onClick={openNewEditor}>Write Your First Article</button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--velune-border)' }}>
                          {['Article', 'Category', 'Status', 'Views', 'Actions'].map(h => (
                            <th key={h} className="label-caps v-muted px-8 py-[14px] text-left font-medium whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allPosts.map((post, i) => (
                          <tr
                            key={post.id}
                            style={{ borderBottom: i < allPosts.length - 1 ? '1px solid var(--velune-border)' : 'none' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--velune-surface)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td className="px-8 py-[16px]" style={{ maxWidth: 400 }}>
                              <div className="font-editorial text-[15px] v-text leading-snug line-clamp-2">{post.title}</div>
                              {post.featured && (
                                <span className="font-sans text-[10px] tracking-[0.12em] uppercase mt-1 inline-block" style={{ color: 'var(--velune-accent)' }}>
                                  ★ Featured
                                </span>
                              )}
                            </td>
                            <td className="label-caps v-accent px-8 py-[16px] whitespace-nowrap">{post.category}</td>
                            <td className="px-8 py-[16px] whitespace-nowrap">
                              <StatusBadge status={post.status} />
                            </td>
                            <td className="font-sans text-[14px] font-medium v-text px-8 py-[16px] whitespace-nowrap">
                              {post.views?.toLocaleString() || '0'}
                            </td>
                            <td className="px-8 py-[16px]">
                              <PostActions
                                post={post}
                                onView={() => navigate(`/article/${post.slug}`)}
                                onEdit={() => openEditEditor(post)}
                                onDelete={() => setDeleteTarget({ id: post.id, title: post.title })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPostPages > 1 && (
                    <div
                      className="flex items-center justify-between px-8 py-5"
                      style={{ borderTop: '1px solid var(--velune-border)' }}
                    >
                      <span className="font-sans text-[12px] v-muted">
                        Page {postsPage} of {totalPostPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary"
                          style={{ padding: '8px 18px', fontSize: 11 }}
                          disabled={postsPage <= 1}
                          onClick={() => setPostsPage(p => p - 1)}
                        >
                          ← Prev
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '8px 18px', fontSize: 11 }}
                          disabled={postsPage >= totalPostPages}
                          onClick={() => setPostsPage(p => p + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Full-screen Article Editor ── */}
      {showEditor && (
        <div className="fixed inset-0 z-[400] flex flex-col" style={{ background: 'var(--velune-bg)' }}>
          {/* Editor nav */}
          <div
            className="flex items-center justify-between px-8 h-14 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--velune-border)', background: 'var(--velune-surface)' }}
          >
            <span className="font-editorial text-[16px] font-semibold v-text">
              {editingId ? 'Edit Article' : 'New Article'}
            </span>
            <div className="flex items-center gap-3">
              <button onClick={handleSaveDraft} className="btn-secondary" disabled={savingDraft || publishing}>
                {savingDraft ? 'Saving…' : editingId ? 'Save as Draft' : 'Save Draft'}
              </button>
              <button onClick={handlePublish} className="btn-primary" disabled={publishing || savingDraft}>
                {publishing ? 'Saving…' : editingId ? 'Update & Publish' : 'Publish'}
              </button>
              <button onClick={closeEditor} className="btn-ghost ml-2 text-[20px]" style={{ color: 'var(--velune-muted)' }}>
                ✕
              </button>
            </div>
          </div>

          {/* Two-column layout: metadata left, editor right */}
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* ── Left sidebar: metadata ── */}
            <div
              className="flex flex-col gap-5 p-6 overflow-y-auto flex-shrink-0"
              style={{ width: 300, borderRight: '1px solid var(--velune-border)', background: 'var(--velune-surface)' }}
            >
              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Title *</label>
                <input
                  className="v-input"
                  value={draft.title}
                  onChange={e => set('title')(e.target.value)}
                  placeholder="Article title…"
                  style={{ fontSize: 15 }}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Category</label>
                <select className="v-input" value={draft.category} onChange={e => set('category')(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Excerpt</label>
                <textarea
                  className="v-input"
                  value={draft.excerpt}
                  onChange={e => set('excerpt')(e.target.value)}
                  placeholder="One-line summary shown on cards…"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Tags (comma-separated)</label>
                <input
                  className="v-input"
                  value={draft.tags}
                  onChange={e => set('tags')(e.target.value)}
                  placeholder="AI, India, Lifestyle"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps v-muted">Cover Image</label>
                {draft.coverImage && !draft.coverImageFile && (
                  <img
                    src={draft.coverImage}
                    alt="cover"
                    style={{ width: '100%', height: 100, objectFit: 'cover', border: '1px solid var(--velune-border)' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="v-input"
                  onChange={e => set('coverImageFile')(e.target.files[0])}
                  style={{ padding: '10px 16px', fontSize: 12 }}
                />
                {draft.coverImageFile && (
                  <span className="font-sans text-[11px] v-muted truncate">{draft.coverImageFile.name}</span>
                )}
              </div>

              {/* Featured toggle */}
              <label
                className="flex items-center gap-3 cursor-pointer"
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${draft.featured ? 'var(--velune-accent)' : 'var(--velune-border)'}`,
                  background: draft.featured ? 'rgba(200,169,110,0.08)' : 'var(--velune-card)',
                  transition: 'border-color 0.18s, background 0.18s',
                }}
              >
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={e => set('featured')(e.target.checked)}
                  style={{ accentColor: 'var(--velune-accent)', width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>
                  <span className="font-sans text-[13px] v-text font-medium block">Featured Article</span>
                  <span className="font-sans text-[11px] v-muted">Shows in the Featured section on homepage</span>
                </span>
              </label>
            </div>

            {/* ── Right: Rich text editor ── */}
            <div className="flex flex-col flex-1 min-h-0 min-w-0">
              <RichTextEditor
                key={editingId || 'new'}
                value={draft.body}
                onChange={set('body')}
                placeholder="Write your article here… Use the toolbar for bold, italic, headings, affiliate links, and inline images."
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <DeleteDialog
          title={deleteTarget.title}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

// ── Inline action buttons component ────────────────────────────────────────
function PostActions({ post, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onView}
        title="View article"
        className="font-sans text-[11px] v-muted bg-transparent border-none cursor-pointer tracking-[0.1em] uppercase whitespace-nowrap hover:text-[var(--velune-accent)] transition-colors"
        style={{ transition: 'color 0.15s' }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--velune-accent)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--velune-muted)'}
      >
        View
      </button>
      <span style={{ color: 'var(--velune-border)' }}>|</span>
      <button
        onClick={onEdit}
        title="Edit article"
        className="font-sans text-[11px] bg-transparent border-none cursor-pointer tracking-[0.1em] uppercase whitespace-nowrap"
        style={{ color: 'var(--velune-accent)', transition: 'color 0.15s' }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--velune-accent-hover)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--velune-accent)'}
      >
        Edit
      </button>
      <span style={{ color: 'var(--velune-border)' }}>|</span>
      <button
        onClick={onDelete}
        title="Delete article"
        className="font-sans text-[11px] bg-transparent border-none cursor-pointer tracking-[0.1em] uppercase whitespace-nowrap"
        style={{ color: '#c0392b', transition: 'color 0.15s' }}
        onMouseOver={e => e.currentTarget.style.color = '#e74c3c'}
        onMouseOut={e => e.currentTarget.style.color = '#c0392b'}
      >
        Delete
      </button>
    </div>
  );
}
