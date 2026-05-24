import { useNavigate } from 'react-router-dom';
import CategoryBadge from '../ui/CategoryBadge';
import EditorialImage from '../ui/EditorialImage';

export default function ArticleCard({ article }) {
  const navigate = useNavigate();

  return (
    <article
      className="article-card"
      onClick={() => navigate(`/article/${article.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/article/${article.slug}`)}
      aria-label={`Read: ${article.title}`}
    >
      <div className="h-[210px] overflow-hidden flex-shrink-0">
        <EditorialImage category={article.category} src={article.coverImage} alt={article.title} />
      </div>
      <div className="p-[22px_24px_24px] flex flex-col gap-[11px] flex-1">
        <CategoryBadge category={article.category} />
        <h3
          className="font-editorial text-[19px] font-semibold v-text leading-[1.28] m-0 line-clamp-3 text-balance"
        >
          {article.title}
        </h3>
        <p className="font-sans text-[13px] v-muted leading-[1.68] m-0 line-clamp-2">
          {article.excerpt}
        </p>
        <div
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: '1px solid var(--velune-border)' }}
        >
          <span className="font-sans text-[11px] v-muted">{article.author?.name}</span>
          <span className="font-sans text-[11px] v-muted tracking-[0.04em]">
            {article.readTime} read
          </span>
        </div>
      </div>
    </article>
  );
}
