import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, selectArticles, selectArticlesLoading } from '../store/slices/articlesSlice';
import ArticleCard from '../components/articles/ArticleCard';
import NewsletterSection from '../components/ui/NewsletterSection';
import EditorialImage from '../components/ui/EditorialImage';
import AdBanner from '../components/ads/AdBanner';
import Spinner from '../components/ui/Spinner';

export default function CategoryPage() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const articles = useSelector(selectArticles);
  const loading  = useSelector(selectArticlesLoading);

  useEffect(() => {
    dispatch(fetchArticles({ category, limit: 24 }));
  }, [dispatch, category]);

  return (
    <>
      <Helmet>
        <title>{category} — Velune</title>
        <meta name="description" content={`${category} stories on Velune — premium editorial for aspirational urban India.`} />
      </Helmet>

      {/* Category Hero */}
      <div className="relative overflow-hidden" style={{ height: 340, paddingTop: 68 }}>
        <div className="absolute inset-0">
          <EditorialImage category={category} large />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-[0_56px_48px]">
          <span className="label-caps v-accent block mb-[14px]">Section</span>
          <h1 className="font-editorial text-[56px] font-bold m-0 mb-[10px] tracking-[-0.01em]" style={{ color: '#f0ece3' }}>
            {category}
          </h1>
          <p className="font-sans text-[14px] m-0" style={{ color: 'rgba(240,236,227,0.55)' }}>
            {loading ? '…' : `${articles.length} ${articles.length === 1 ? 'story' : 'stories'}`}
          </p>
        </div>
      </div>

      <AdBanner slot="category-top" className="mt-6" />

      {/* Articles */}
      <div className="container-velune pt-16 pb-20">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : articles.length > 0 ? (
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {articles.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <div className="text-center py-20 font-editorial text-[22px] v-muted italic">
            More stories coming soon.
          </div>
        )}
      </div>

      <NewsletterSection />
    </>
  );
}
