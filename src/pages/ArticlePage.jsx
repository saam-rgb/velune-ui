import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticle, fetchRelated, selectCurrentArticle, selectRelated, selectArticlesLoading } from '../store/slices/articlesSlice';
import CategoryBadge from '../components/ui/CategoryBadge';
import SectionHeader from '../components/ui/SectionHeader';
import ArticleCard from '../components/articles/ArticleCard';
import EditorialImage from '../components/ui/EditorialImage';
import AdBanner from '../components/ads/AdBanner';
import Spinner from '../components/ui/Spinner';
import { ArrowLeft } from '../components/ui/Icons';
import { trackPageView } from '../utils/analytics';

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const article = useSelector(selectCurrentArticle);
  const related = useSelector(selectRelated(slug));
  const loading  = useSelector(selectArticlesLoading);

  useEffect(() => {
    dispatch(fetchArticle(slug));
    dispatch(fetchRelated(slug));
    trackPageView(`/article/${slug}`);
  }, [dispatch, slug]);

  if (loading && !article) {
    return <div className="flex items-center justify-center h-screen"><Spinner size={32} /></div>;
  }

  if (!article && !loading) {
    return (
      <div className="pt-[120px] text-center container-velune">
        <p className="font-editorial text-[24px] v-muted">Story not found.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">Back to Home</button>
      </div>
    );
  }

  if (!article) return null;

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const bodyParagraphs = Array.isArray(article.body) ? article.body : [article.body];

  return (
    <>
      <Helmet>
        <title>{article.title} — Velune</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.coverImage && <meta property="og:image" content={article.coverImage} />}
      </Helmet>

      {/* Article Hero */}
      <div className="relative overflow-hidden" style={{ height: 500 }}>
        <div className="absolute inset-0">
          <EditorialImage category={article.category} src={article.coverImage} alt={article.title} large />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.92) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-[0_56px_52px]">
          <div className="flex items-center gap-[14px] mb-5">
            <CategoryBadge category={article.category} />
            <span className="font-sans text-[12px]" style={{ color: 'rgba(240,236,227,0.45)' }}>
              {publishedDate} · {article.readTime} read
            </span>
          </div>
          <h1
            className="font-editorial font-bold m-0 leading-[1.1] text-balance"
            style={{ fontSize: 'clamp(28px,4vw,54px)', color: '#f0ece3', maxWidth: 820 }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="container-velune">
        <div className="pt-[60px] pb-20" style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Author row */}
          <div
            className="flex items-center gap-4 pb-8 mb-10"
            style={{ borderBottom: '1px solid var(--velune-border)' }}
          >
            <div
              className="w-[46px] h-[46px] rounded-full flex items-center justify-center font-sans text-[13px] font-semibold v-accent flex-shrink-0"
              style={{ background: 'var(--velune-surface)', border: '1px solid var(--velune-border)' }}
            >
              {article.author?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'VL'}
            </div>
            <div>
              <div className="font-sans text-[14px] font-medium v-text">{article.author?.name}</div>
              <div className="font-sans text-[12px] v-muted mt-[2px]">{article.author?.bio || 'Velune Editorial'}</div>
            </div>
          </div>

          {/* Pull quote */}
          <p
            className="font-editorial text-[22px] italic v-muted leading-[1.65] mb-11 pl-7"
            style={{ borderLeft: '2px solid var(--velune-accent)' }}
          >
            {article.excerpt}
          </p>

          {/* In-article ad */}
          <AdBanner slot="article-inline" className="mb-8" />

          {/* Body — HTML (Tiptap) or plain-text array (legacy seed data) */}
          {typeof article.body === 'string' ? (
            <div
              className="velune-article-body"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          ) : (
            bodyParagraphs.map((para, i) => (
              <p key={i} className="font-sans text-[17px] v-text leading-[1.9] mb-[30px] text-pretty">
                {para}
              </p>
            ))
          )}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div
              className="flex gap-[10px] flex-wrap mt-[52px] pt-10"
              style={{ borderTop: '1px solid var(--velune-border)' }}
            >
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="font-sans text-[10px] tracking-[0.14em] uppercase v-muted px-4 py-2"
                  style={{ border: '1px solid var(--velune-border)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mt-12 flex items-center gap-[10px] font-sans text-[11px] v-accent bg-transparent border-none cursor-pointer tracking-[0.16em] uppercase font-medium p-0"
          >
            <ArrowLeft size={13} />
            Back to Velune
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ background: 'var(--velune-surface)', borderTop: '1px solid var(--velune-border)', padding: '64px 0 80px' }}>
          <div className="container-velune">
            <SectionHeader title="You Might Also Like" />
            <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {related.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
