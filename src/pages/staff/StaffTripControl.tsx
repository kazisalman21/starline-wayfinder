import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bus, Clock, Users, Play, MapPin, AlertTriangle, CheckCircle2,
  ChevronRight, Star, Phone, MessageSquare, Wifi, Battery, RotateCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripOpsStore, staffUsers } from '@/data/tripOpsData';
import TripStatusBadge from '@/components/tripops/TripStatusBadge';
import RouteProgressTracker from '@/components/tripops/RouteProgressTracker';
import LiveLocationCard from '@/components/tripops/LiveLocationCard';
import MarkArrivedDialog from '@/components/tripops/MarkArrivedDialog';
import DelayReportDialog from '@/components/tripops/DelayReportDialog';
import starlineLogo from '@/assets/starline-logo.png';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StaffTripControl() {
  const { tripId } = useParams();
  const nav = useNavigate();
  const { currentUser, getTrip, setStatus, advanceStop } = useTripOpsStore();
  const trip = getTrip(tripId ?? '');
  const [arrivedOpen, setArrivedOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    if (!currentUser) nav('/staff/login');
  }, [currentUser, nav]);

  if (!currentUser) return null;
  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-lg font-semibold mb-2">Trip not found</h2>
          <Button asChild><Link to="/staff/trips">Back to today's trips</Link></Button>
        </div>
      </div>
    );
  }

  const driver = staffUsers.find(u => u.id === trip.driverId);
  const supervisor = staffUsers.find(u => u.id === trip.supervisorId);
  const occupancy = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
  const isArrived = trip.status === 'arrived';
  const offline = trip.network === 'offline';

  const startBoarding = () => { setStatus(trip.id, 'boarding'); toast.success('Boarding started'); };
  const markDeparted  = () => { setStatus(trip.id, 'in_transit'); toast.success('Trip marked as departed'); };
  const updateStop    = () => {
    advanceStop(trip.id);
    toast.success('Stop updated', { description: 'Next stop is now current' });
  };
  const reconnect = () => {
    setReconnecting(true);
    setTimeout(() => { setReconnecting(false); toast.success('Connection restored'); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/40">
        <div className="container py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/staff/trips"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <Link to="/" className="hidden sm:block"><img src={starlineLogo} alt="Star Line" className="h-7 w-auto" /></Link>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent font-semibold">Trip Control</div>
            <div className="text-sm font-semibold text-foreground truncate">{trip.id}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className={cn('w-3.5 h-3.5', trip.network === 'online' ? 'text-success' : trip.network === 'weak' ? 'text-warning' : 'text-destructive')} />
            <Battery className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="container py-5 sm:py-7 space-y-5">
        {/* Offline banner */}
        {offline && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 border-destructive/40 bg-destructive/10 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">You're offline</div>
              <div className="text-xs text-muted-foreground">Updates will sync when connection is restored.</div>
            </div>
            <Button size="sm" variant="outline" onClick={reconnect} disabled={reconnecting}>
              <RotateCw className={cn('w-3.5 h-3.5', reconnecting && 'animate-spin')} />
              Retry
            </Button>
          </motion.div>
        )}

        {/* Hero summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <TripStatusBadge status={trip.status} pulse={trip.status === 'in_transit' || trip.status === 'delayed'} />
              <h1 className="text-2xl sm:text-3xl font-bold mt-2 leading-tight">
                {trip.from} <ChevronRight className="inline w-5 h-5 text-muted-foreground" /> {trip.to}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Bus className="w-3.5 h-3.5" />
                <span className="text-foreground font-medium">{trip.busName}</span>
                <span>·</span>
                <span className="font-mono text-xs">{trip.busReg}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${supervisor?.phone}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/60 border border-border/40 text-xs font-semibold hover:bg-secondary">
                <Phone className="w-3.5 h-3.5 text-accent" /> Supervisor
              </a>
              <a href="tel:999" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Emergency
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/40">
            <Metric label="Departure" value={trip.actualDeparture ?? trip.departureTime} sub={trip.actualDeparture ? 'actual' : 'scheduled'} />
            <Metric label="ETA" value={trip.expectedArrival} sub={trip.delays.length > 0 ? `+${trip.delays.reduce((s, d) => s + d.estimatedMinutes, 0)} min` : 'on time'} />
            <Metric label="Progress" value={`${trip.progressPercent}%`} sub={`${trip.stops.filter(s => s.status === 'completed').length}/${trip.stops.length - 1} stops`} />
            <Metric label="Coach" value={trip.coachType} sub={`৳ ${trip.fare}`} />
          </div>
        </motion.div>

        {/* Action buttons */}
        {!isArrived && (
          <div className="glass-card p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Trip controls</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              <ActionButton
                icon={Users} label="Start Boarding" tone="accent"
                disabled={trip.status !== 'scheduled'}
                active={trip.status === 'boarding'}
                onClick={startBoarding}
              />
              <ActionButton
                icon={Play} label="Mark Departed" tone="primary"
                disabled={!['boarding', 'scheduled'].includes(trip.status)}
                active={trip.status === 'in_transit'}
                onClick={markDeparted}
              />
              <ActionButton
                icon={MapPin} label="Update Stop" tone="info"
                disabled={!['in_transit', 'delayed'].includes(trip.status)}
                onClick={updateStop}
              />
              <ActionButton
                icon={AlertTriangle} label="Mark Delayed" tone="destructive"
                disabled={isArrived}
                active={trip.status === 'delayed'}
                onClick={() => setDelayOpen(true)}
              />
              <ActionButton
                icon={CheckCircle2} label="Mark Arrived" tone="success"
                disabled={!['in_transit', 'delayed'].includes(trip.status)}
                onClick={() => setArrivedOpen(true)}
                className="col-span-2 md:col-span-1"
              />
            </div>
          </div>
        )}

        {/* Live location */}
        <LiveLocationCard trip={trip} />

        {/* Route progress */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Route Progress</h2>
            <span className="text-xs font-mono text-muted-foreground">{trip.progressPercent}% complete</span>
          </div>
          <RouteProgressTracker stops={trip.stops} />
        </div>

        {/* Passenger / trip summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Passenger summary</h2>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <SummaryStat label="On-board" value={trip.passengerCount} accent />
              <SummaryStat label="Booked" value={trip.bookedSeats} />
              <SummaryStat label="Available" value={trip.totalSeats - trip.bookedSeats} />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="font-mono text-foreground">{occupancy}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${occupancy}%` }} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Coach type</div>
                <div className="font-semibold text-foreground">{trip.coachType}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Fare</div>
                <div className="font-semibold text-foreground">৳ {trip.fare}</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Crew</h2>
              <Phone className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-3">
              <CrewRow role="Driver" name={driver?.name ?? '—'} badge={driver?.badge ?? ''} phone={driver?.phone} />
              <CrewRow role="Supervisor" name={supervisor?.name ?? '—'} badge={supervisor?.badge ?? ''} phone={supervisor?.phone} />
            </div>
            {trip.delays.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="text-[11px] uppercase tracking-wider text-destructive font-semibold mb-2">Active delays</div>
                {trip.delays.map(d => (
                  <div key={d.id} className="text-xs p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 mb-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{d.reason}</span>
                      <span className="font-mono text-destructive">+{d.estimatedMinutes} min</span>
                    </div>
                    {d.note && <div className="text-muted-foreground mt-0.5">{d.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post-arrival summary */}
        {isArrived && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Trip completed</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Arrived at <span className="text-foreground font-semibold">{trip.to}</span> · {trip.actualArrival ?? trip.expectedArrival}
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-5">
              <SummaryStat label="Departure" value={trip.actualDeparture ?? trip.departureTime} mono />
              <SummaryStat label="Arrival" value={trip.actualArrival ?? trip.expectedArrival} mono />
              <SummaryStat label="Status" value="Arrived" />
            </div>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-xs text-accent font-semibold">
              <Star className="w-3.5 h-3.5" />
              Passengers can now rate this trip
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <Button variant="outline" asChild><Link to="/staff/trips">Back to trips</Link></Button>
              <Button asChild><Link to="/admin">Open admin review</Link></Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Sticky mobile action bar */}
      {!isArrived && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border/40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="lg" onClick={() => setDelayOpen(true)} disabled={isArrived}>
              <AlertTriangle className="w-4 h-4 text-destructive" /> Delay
            </Button>
            {trip.status === 'scheduled' && (
              <Button size="lg" onClick={startBoarding}><Users className="w-4 h-4"/> Start Boarding</Button>
            )}
            {trip.status === 'boarding' && (
              <Button size="lg" onClick={markDeparted}><Play className="w-4 h-4"/> Mark Departed</Button>
            )}
            {(trip.status === 'in_transit' || trip.status === 'delayed') && (
              <Button size="lg" onClick={() => setArrivedOpen(true)} className="btn-primary-glow">
                <CheckCircle2 className="w-4 h-4"/> Mark Arrived
              </Button>
            )}
          </div>
        </div>
      )}

      <MarkArrivedDialog open={arrivedOpen} onOpenChange={setArrivedOpen} trip={trip} />
      <DelayReportDialog open={delayOpen} onOpenChange={setDelayOpen} trip={trip} />
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-lg font-bold text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function SummaryStat({ label, value, accent, mono }: { label: string; value: string | number; accent?: boolean; mono?: boolean }) {
  return (
    <div className="text-center p-3 rounded-lg bg-secondary/40 border border-border/40">
      <div className={cn('text-2xl font-bold', mono && 'font-mono', accent ? 'text-accent' : 'text-foreground')}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function CrewRow({ role, name, badge, phone }: { role: string; name: string; badge: string; phone?: string }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/40">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
        {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">{role}</div>
        <div className="text-sm font-semibold text-foreground truncate">{name}</div>
        <div className="text-[10px] font-mono text-muted-foreground">{badge}</div>
      </div>
      {phone && (
        <a href={`tel:${phone}`} className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center hover:bg-accent/25">
          <Phone className="w-4 h-4 text-accent" />
        </a>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon, label, tone, disabled, active, onClick, className,
}: {
  icon: typeof Bus; label: string;
  tone: 'primary' | 'accent' | 'success' | 'destructive' | 'info';
  disabled?: boolean; active?: boolean; onClick: () => void; className?: string;
}) {
  const tones: Record<string, string> = {
    primary:     'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20',
    accent:      'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20',
    success:     'bg-success/10 border-success/30 text-success hover:bg-success/20',
    destructive: 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20',
    info:        'bg-info/10 border-info/30 text-info hover:bg-info/20',
  };
  const activeTones: Record<string, string> = {
    primary:     'bg-primary text-primary-foreground border-primary btn-primary-glow',
    accent:      'bg-accent text-accent-foreground border-accent btn-accent-glow',
    success:     'bg-success text-success-foreground border-success',
    destructive: 'bg-destructive text-destructive-foreground border-destructive',
    info:        'bg-info text-info-foreground border-info',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 font-semibold text-xs transition-all min-h-[76px]',
        active ? activeTones[tone] : tones[tone],
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent',
        className,
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="leading-tight text-center">{label}</span>
    </button>
  );
}
