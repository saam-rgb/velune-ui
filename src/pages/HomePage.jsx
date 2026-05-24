import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, selectArticles, selectArticlesLoading } from '../store/slices/articlesSlice';
import HeroSection from '../components/articles/HeroSection';
import FeaturedCard from '../components/articles/FeaturedCard';
import ArticleCard from '../components/articles/ArticleCard';
import CategoryStrip from '../components/articles/CategoryStrip';
import SectionHeader from '../components/ui/SectionHeader';
import NewsletterSection from '../components/ui/NewsletterSection';
import AdBanner from '../components/ads/AdBanner';
import Spinner from '../components/ui/Spinner';

export default function HomePage() {
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const loading = useSelector(selectArticlesLoading);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchArticles({ limit: 20 }));
  }, [dispatch]);

  const heroArticle   = articles.find(a => a.hero);
  const featuredArticles = articles.filter(a => a.featured && !a.hero).slice(0, 2);
  const gridArticles  = activeCategory === 'All'
    ? articles.filter(a => !a.hero)
    : articles.filter(a => a.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Velune — Premium Editorial</title>
        <meta name="description" content="Premium editorial for aspirational urban India. Stories in Tech, Fashion, Health, Lifestyle, and Grooming." />
      </Helmet>

      {loading && !articles.length ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size={32} />
        </div>
      ) : (
        <>
          {heroArticle && <HeroSection article={heroArticle} />}

          {/* In-content ad after hero */}
          <AdBanner slot="homepage-top" className="mt-8" />

          {/* Featured */}
          {featuredArticles.length > 0 && (
            <div className="container-velune py-20">
              <SectionHeader title="Featured" />
              <div
                className="grid gap-[60px]"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
              >
                {featuredArticles.map(a => <FeaturedCard key={a.id} article={a} />)}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--velune-border)' }} />

          {/* Article grid */}
          <div className="container-velune pt-[72px] pb-20">
            <div className="mb-8">
              <SectionHeader title="Latest Stories" onSeeAll={() => setActiveCategory('All')} />
              <CategoryStrip active={activeCategory} onSelect={setActiveCategory} />
            </div>

            {/* Mid-page ad */}
            <AdBanner slot="homepage-mid" className="mb-8" />

            {gridArticles.length > 0 ? (
              <div className="grid gap-7 mt-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {gridArticles.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            ) : (
              <div className="text-center py-16 font-editorial text-[20px] v-muted italic">
                More stories coming soon.
              </div>
            )}
          </div>

          <NewsletterSection />
        </>
      )}
    </>
  );
}
