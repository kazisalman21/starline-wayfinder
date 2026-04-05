import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
            'relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
            active === cat
              ? 'text-primary border-primary/30'
              : 'bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/20'
          )}
        >
          {active === cat && (
            <motion.div
              layoutId="notice-filter-bg"
              className="absolute inset-0 bg-primary/15 rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}
