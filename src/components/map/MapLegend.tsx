import { motion } from 'framer-motion';

const legendItems = [
  { label: 'Terminal', color: 'hsl(355, 70%, 42%)', shape: 'diamond' as const },
  { label: 'Boarding', color: 'hsl(152, 60%, 40%)', shape: 'circle' as const },
  { label: 'Dropping', color: 'hsl(210, 75%, 52%)', shape: 'circle' as const },
  { label: 'Break Point', color: 'hsl(42, 85%, 52%)', shape: 'circle' as const },
  { label: 'Completed', color: 'hsl(152, 60%, 45%)', shape: 'line' as const },
  { label: 'Remaining', color: 'hsl(355, 70%, 42%)', shape: 'line-dashed' as const },
  { label: 'Live Bus', color: 'hsl(355, 70%, 42%)', shape: 'bus' as const },
];

export default function MapLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 bg-card/70 backdrop-blur-xl border border-border/30 rounded-xl"
    >
      {legendItems.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {item.shape === 'circle' && (
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
          )}
          {item.shape === 'diamond' && (
            <div className="w-2.5 h-2.5 rotate-45" style={{ background: item.color }} />
          )}
          {item.shape === 'line' && (
            <div className="w-4 h-0.5 rounded-full" style={{ background: item.color }} />
          )}
          {item.shape === 'line-dashed' && (
            <div className="w-4 h-0.5 rounded-full" style={{ background: item.color, opacity: 0.5 }} />
          )}
          {item.shape === 'bus' && (
            <div className="w-3 h-2 rounded-sm" style={{ background: item.color }} />
          )}
          <span className="text-[10px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
