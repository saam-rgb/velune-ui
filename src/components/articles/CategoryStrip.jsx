const CATEGORIES = ['All', 'Tech', 'Fashion', 'Health', 'Lifestyle', 'Grooming'];

export default function CategoryStrip({ active, onSelect }) {
  return (
    <div className="flex gap-[6px] overflow-x-auto pb-[2px]">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`cat-btn${active === cat ? ' active' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
