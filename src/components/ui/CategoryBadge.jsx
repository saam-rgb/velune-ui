export default function CategoryBadge({ category, className = '' }) {
  return (
    <span
      className={`label-caps v-accent ${className}`}
    >
      {category}
    </span>
  );
}
