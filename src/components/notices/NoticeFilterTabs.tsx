import { cn } from '@/lib/utils';

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function NoticeFilterTabs({ categories, active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
            active === cat
              ? 'bg-primary/15 text-primary border-primary/30'
              : 'bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/20'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
