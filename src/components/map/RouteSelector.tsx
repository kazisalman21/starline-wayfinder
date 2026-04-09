import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Route, ChevronRight } from 'lucide-react';

interface RouteSelectorRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  stops: number;
  isActive?: boolean;
}

interface RouteSelectorProps {
  routes: RouteSelectorRoute[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RouteSelector({ routes, selectedId, onSelect }: RouteSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Select Route
      </h3>
      {routes.map((route, i) => {
        const isSelected = route.id === selectedId;
        return (
          <motion.button
            key={route.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(route.id)}
            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
              isSelected
                ? 'bg-primary/8 border-primary/30 shadow-[0_0_20px_hsl(355_70%_42%/0.08)]'
                : 'bg-card/50 border-border/30 hover:bg-secondary/50 hover:border-border/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Route className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {route.from}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {route.to}
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-primary rotate-90' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.duration}</span>
              <span>{route.distance}</span>
              <span>{route.stops} stops</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export type { RouteSelectorRoute };
