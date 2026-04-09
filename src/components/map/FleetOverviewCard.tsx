import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { BusMarker } from './MapCanvas';

interface FleetBus extends BusMarker {
  routeName: string;
  nextStop: string;
  eta: string;
  progress: number;
}

interface FleetOverviewCardProps {
  buses: FleetBus[];
  onBusSelect: (busId: string) => void;
  selectedBusId?: string | null;
}

export default function FleetOverviewCard({ buses, onBusSelect, selectedBusId }: FleetOverviewCardProps) {
  const onTime = buses.filter(b => b.status === 'on-time').length;
  const delayed = buses.filter(b => b.status === 'delayed').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card-elevated p-4 w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm">Fleet Status</h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-success">
            <CheckCircle2 className="w-3 h-3" /> {onTime} On Time
          </span>
          {delayed > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="w-3 h-3" /> {delayed} Delayed
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
        {buses.map((bus) => {
          const isSelected = bus.id === selectedBusId;
          return (
            <button
              key={bus.id}
              onClick={() => onBusSelect(bus.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/8 border-primary/30'
                  : 'bg-secondary/30 border-border/20 hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Bus className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-semibold">{bus.label}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  bus.status === 'on-time' ? 'bg-success/10 text-success' :
                  bus.status === 'delayed' ? 'bg-destructive/10 text-destructive' :
                  'bg-accent/10 text-accent'
                }`}>
                  {bus.status === 'on-time' ? 'On Time' : bus.status === 'delayed' ? 'Delayed' : 'Early'}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mb-1">{bus.routeName}</div>
              <div className="flex items-center gap-2 text-[10px]">
                <MapPin className="w-3 h-3 text-primary" />
                <span>Next: {bus.nextStop}</span>
                <Clock className="w-3 h-3 text-muted-foreground ml-auto" />
                <span>{bus.eta}</span>
              </div>
              {/* Mini progress */}
              <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${bus.progress}%`,
                    background: bus.status === 'delayed'
                      ? 'hsl(0, 84%, 60%)'
                      : 'linear-gradient(90deg, hsl(355, 70%, 42%), hsl(42, 85%, 52%))',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export type { FleetBus };
