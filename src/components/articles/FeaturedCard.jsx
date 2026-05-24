import { useNavigate } from 'react-router-dom';
import CategoryBadge from '../ui/CategoryBadge';
import EditorialImage from '../ui/EditorialImage';

export default function FeaturedCard({ article }) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/article/${article.slug}`)}
      className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/article/${article.slug}`)}
    >
      <div className="h-[280px] overflow-hidden relative flex-shrink-0">
        <EditorialImage category={article.category} src={article.coverImage} alt={article.title} />
      </div>
      <div className="pt-7 flex flex-col gap-3">
        <CategoryBadge category={article.category} />
        <h2 className="font-editorial text-[26px] font-semibold v-text leading-[1.22] m-0 text-balance">
          {article.title}
        </h2>
        <p className="font-sans text-[14px] v-muted leading-[1.72] m-0">
          {article.excerpt}
        </p>
        <div
          className="flex items-center justify-between pt-5 mt-2"
          style={{ borderTop: '1px solid var(--velune-border)' }}
        >
          <span className="font-sans text-[12px] v-muted">{article.author?.name}</span>
          <span className="font-sans text-[11px] v-muted tracking-[0.06em]">
            {article.date || article.publishedAt?.split('T')[0]} · {article.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}
