import { Check, MapPin, Coffee, Flag, Circle } from 'lucide-react';
import { TripStop } from '@/data/tripOpsData';
import { cn } from '@/lib/utils';

const iconFor = (type: TripStop['type']) => {
  switch (type) {
    case 'boarding':    return MapPin;
    case 'counter':     return Circle;
    case 'break':       return Coffee;
    case 'destination': return Flag;
  }
};

export default function RouteProgressTracker({ stops }: { stops: TripStop[] }) {
  return (
    <div className="relative">
      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative pt-2 pb-1">
          {/* base line */}
          <div className="absolute left-4 right-4 top-7 h-1 rounded-full bg-secondary" />
          {/* progress line */}
          <div
            className="absolute left-4 top-7 h-1 rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{
              width: `calc((100% - 2rem) * ${
                Math.max(0, stops.findIndex(s => s.status === 'current')) /
                Math.max(1, stops.length - 1)
              })`,
            }}
          />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${stops.length}, 1fr)` }}>
            {stops.map(stop => {
              const Icon = iconFor(stop.type);
              const isCurrent  = stop.status === 'current';
              const isComplete = stop.status === 'completed';
              const isDest     = stop.type === 'destination';
              return (
                <div key={stop.id} className="flex flex-col items-center text-center px-1">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative z-10',
                      isComplete && 'bg-success border-success text-success-foreground',
                      isCurrent && 'bg-primary border-primary text-primary-foreground btn-primary-glow scale-110',
                      !isCurrent && !isComplete && isDest && 'bg-card border-accent/60 text-accent',
                      !isCurrent && !isComplete && !isDest && 'bg-card border-border text-muted-foreground',
                    )}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="mt-2 max-w-[120px]">
                    <div className={cn(
                      'text-[11px] font-semibold leading-tight truncate',
                      isCurrent && 'text-primary',
                      isComplete && 'text-foreground',
                      !isCurrent && !isComplete && 'text-muted-foreground',
                    )}>
                      {stop.name}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {stop.actualTime ?? stop.scheduledTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0">
        {stops.map((stop, i) => {
          const Icon = iconFor(stop.type);
          const isCurrent  = stop.status === 'current';
          const isComplete = stop.status === 'completed';
          const isLast = i === stops.length - 1;
          return (
            <div key={stop.id} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10',
                    isComplete && 'bg-success border-success text-success-foreground',
                    isCurrent && 'bg-primary border-primary text-primary-foreground btn-primary-glow',
                    !isCurrent && !isComplete && 'bg-card border-border text-muted-foreground',
                  )}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                {!isLast && (
                  <div className={cn(
                    'w-0.5 flex-1 min-h-[28px] my-1',
                    isComplete ? 'bg-success/60' : 'bg-border',
                  )} />
                )}
              </div>
              <div className={cn('pb-5 pt-1 flex-1 min-w-0', isLast && 'pb-0')}>
                <div className="flex items-center justify-between gap-2">
                  <div className={cn(
                    'text-sm font-semibold truncate',
                    isCurrent && 'text-primary',
                    isComplete && 'text-foreground',
                    !isCurrent && !isComplete && 'text-muted-foreground',
                  )}>
                    {stop.name}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground shrink-0">
                    {stop.actualTime ?? stop.scheduledTime}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {stop.type === 'destination' ? 'Final destination' : stop.type}
                  {isCurrent && ' · current'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
