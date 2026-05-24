export default function SectionHeader({ title, onSeeAll, className = '' }) {
  return (
    <div
      className={`flex items-baseline justify-between pb-[18px] mb-10 ${className}`}
      style={{ borderBottom: '1px solid var(--velune-border)' }}
    >
      <h2 className="font-editorial text-[28px] font-semibold v-text m-0">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="label-caps v-accent bg-transparent border-none cursor-pointer font-medium"
        >
          See All
        </button>
      )}
    </div>
  );
}
