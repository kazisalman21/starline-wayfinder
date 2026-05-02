import { motion } from 'framer-motion';
import { Navigation, Wifi, WifiOff, Battery, Radio, MapPin } from 'lucide-react';
import { Trip } from '@/data/tripOpsData';
import { cn } from '@/lib/utils';

export default function LiveLocationCard({ trip }: { trip: Trip }) {
  const currentStop = trip.stops.find(s => s.status === 'current');
  const nextStop = trip.stops[trip.stops.findIndex(s => s.status === 'current') + 1];

  const signalColor = {
    strong: 'text-success',
    weak: 'text-warning',
    lost: 'text-destructive',
  }[trip.gpsSignal];

  const netIcon = trip.network === 'offline' ? WifiOff : Wifi;
  const NetIcon = netIcon;

  return (
    <div className="glass-card overflow-hidden">
      {/* Stylized map placeholder */}
      <div className="relative h-48 sm:h-56 bg-secondary/40 overflow-hidden">
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.15) 0px, transparent 40%),' +
              'radial-gradient(circle at 80% 70%, hsl(var(--primary) / 0.12) 0px, transparent 45%),' +
              'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
          }}
        />
        {/* grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),' +
              'linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* curved route */}
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path d="M 30 160 Q 150 40 220 110 T 380 50" stroke="hsl(var(--accent))" strokeWidth="2.5" fill="none" strokeDasharray="6 4" opacity="0.6"/>
          <path d="M 30 160 Q 150 40 220 110" stroke="hsl(var(--primary))" strokeWidth="3" fill="none"/>
          <circle cx="30" cy="160" r="6" fill="hsl(var(--success))"/>
          <circle cx="380" cy="50" r="6" fill="hsl(var(--accent))"/>
        </svg>
        {/* moving bus marker */}
        <motion.div
          className="absolute"
          initial={{ left: '20%', top: '60%' }}
          animate={{ left: '55%', top: '50%' }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full bg-primary/30 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-background btn-primary-glow" />
          </div>
        </motion.div>

        {/* Top overlay status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-border/40 text-[11px] font-semibold">
            <Radio className={cn('w-3 h-3', trip.liveTracking ? 'text-success animate-pulse' : 'text-muted-foreground')} />
            {trip.liveTracking ? 'Location updating' : 'Tracking paused'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 backdrop-blur border border-border/40 text-[10px] font-semibold', signalColor)}>
              <Navigation className="w-3 h-3" />
              GPS · {trip.gpsSignal}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 backdrop-blur border border-border/40 text-[10px] font-semibold text-muted-foreground">
              <NetIcon className="w-3 h-3" />
              {trip.network}
            </span>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="p-4 grid grid-cols-3 gap-3 border-t border-border/40">
        <Stat label="ETA" value={trip.expectedArrival} mono />
        <Stat label="Current" value={currentStop?.name ?? '—'} />
        <Stat label="Next stop" value={nextStop?.name ?? 'Final'} />
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn('text-sm font-semibold text-foreground truncate', mono && 'font-mono')}>{value}</div>
    </div>
  );
}
