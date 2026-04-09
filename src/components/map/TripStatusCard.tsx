import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, ArrowRight, Bus, Wifi, Coffee, Phone, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TripStatusCardProps {
  routeName: string;
  busLabel: string;
  bookingId: string;
  status: 'in-transit' | 'boarding' | 'arrived' | 'scheduled';
  currentLocation: string;
  nextStop: string;
  eta: string;
  progress: number;
  from: string;
  to: string;
  departureTime: string;
  seatClass?: string;
  lastUpdate: string;
  onClose?: () => void;
}

const statusConfig = {
  'in-transit': { label: 'In Transit', color: 'bg-success/15 text-success border-success/20' },
  'boarding': { label: 'Boarding', color: 'bg-accent/15 text-accent border-accent/20' },
  'arrived': { label: 'Arrived', color: 'bg-info/15 text-info border-info/20' },
  'scheduled': { label: 'Scheduled', color: 'bg-muted text-muted-foreground border-border' },
};

export default function TripStatusCard({
  routeName, busLabel, bookingId, status, currentLocation, nextStop,
  eta, progress, from, to, departureTime, seatClass, lastUpdate, onClose,
}: TripStatusCardProps) {
  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-elevated p-5 w-full max-w-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-display font-bold text-sm">{busLabel}</div>
            <div className="text-[11px] text-muted-foreground">{bookingId}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
          {seatClass && <span className="text-[10px] text-accent font-medium">{seatClass}</span>}
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-foreground">{from}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{to}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{departureTime}</span>
      </div>

      {/* Current location */}
      <div className="bg-secondary/60 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
          <span className="text-xs font-medium">{currentLocation}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Next: {nextStop}</span>
          <span>ETA {eta}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(355, 70%, 42%), hsl(42, 85%, 52%))' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{from}</span>
          <span className="text-[10px] text-accent font-semibold">{progress}%</span>
          <span className="text-[10px] text-muted-foreground">{to}</span>
        </div>
      </div>

      {/* Services */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
        {[
          { icon: Wifi, label: 'WiFi' },
          { icon: Coffee, label: 'Refreshments' },
          { icon: Phone, label: 'Driver' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <s.icon className="w-3 h-3" />
            <span>{s.label}</span>
          </div>
        ))}
        <span className="text-[10px] text-muted-foreground/50 ml-auto">{lastUpdate}</span>
      </div>
    </motion.div>
  );
}
