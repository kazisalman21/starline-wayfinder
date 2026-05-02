import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, Bus, Radio, AlertTriangle, CheckCircle2,
  Clock, MapPin, ChevronRight, Activity, ArrowRight,
} from 'lucide-react';
import {
  useTripOpsStore, tripStatusMeta, TripStatus, staffUsers,
} from '@/data/tripOpsData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import TripStatusBadge from '@/components/tripops/TripStatusBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusFilters: ('all' | TripStatus)[] = [
  'all', 'scheduled', 'boarding', 'in_transit', 'delayed', 'arrived',
];

export default function AdminTripsMonitor() {
  const { trips, setStatus, markArrived } = useTripOpsStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TripStatus>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [overrideTripId, setOverrideTripId] = useState<string | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<TripStatus>('in_transit');

  const filtered = useMemo(() => {
    return trips.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (routeFilter !== 'all' && t.routeName !== routeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (![t.id, t.routeName, t.busName, t.busReg].some(v => v.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [trips, statusFilter, routeFilter, search]);

  const routes = useMemo(() => Array.from(new Set(trips.map(t => t.routeName))), [trips]);

  const kpis = {
    active: trips.filter(t => ['boarding', 'in_transit'].includes(t.status)).length,
    delayed: trips.filter(t => t.status === 'delayed').length,
    arrived: trips.filter(t => t.status === 'arrived').length,
    scheduled: trips.filter(t => t.status === 'scheduled').length,
  };

  const overrideTrip = trips.find(t => t.id === overrideTripId);

  const applyOverride = () => {
    if (!overrideTrip) return;
    if (overrideStatus === 'arrived') markArrived(overrideTrip.id);
    else setStatus(overrideTrip.id, overrideStatus);
    toast.success('Trip status overridden', { description: `${overrideTrip.id} → ${tripStatusMeta[overrideStatus].label}` });
    setOverrideTripId(null);
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Activity}     label="Active trips"  value={kpis.active}    tone="text-success" />
        <KpiCard icon={AlertTriangle} label="Delayed"       value={kpis.delayed}   tone="text-destructive" />
        <KpiCard icon={CheckCircle2}  label="Arrived today" value={kpis.arrived}   tone="text-muted-foreground" />
        <KpiCard icon={Clock}         label="Scheduled"     value={kpis.scheduled} tone="text-info" />
      </div>

      {/* Live overview band */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-success animate-pulse" />
            <h3 className="font-semibold">Control Room · Live Overview</h3>
          </div>
          <span className="text-xs text-muted-foreground">{trips.filter(t => t.liveTracking).length} buses transmitting</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trips.filter(t => t.liveTracking).slice(0, 3).map(t => (
            <Link key={t.id} to={`/staff/trip/${t.id}`}
              className="relative p-3 rounded-lg bg-secondary/40 border border-border/40 hover:border-accent/40 transition-colors block">
              <div className="flex items-center justify-between mb-2">
                <TripStatusBadge status={t.status} />
                <span className="text-[10px] font-mono text-muted-foreground">{t.id.slice(-4)}</span>
              </div>
              <div className="text-sm font-semibold truncate">{t.routeName}</div>
              <div className="text-xs text-muted-foreground truncate">{t.busName}</div>
              <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${t.progressPercent}%` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                <span>{t.progressPercent}%</span>
                <span>ETA {t.expectedArrival}</span>
              </div>
            </Link>
          ))}
          {trips.filter(t => t.liveTracking).length === 0 && (
            <div className="md:col-span-3 text-sm text-muted-foreground text-center py-6">No live trips right now.</div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by trip ID, route or bus…" className="pl-9" />
          </div>
          <Select value={routeFilter} onValueChange={setRouteFilter}>
            <SelectTrigger className="md:w-56"><SelectValue placeholder="All routes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All routes</SelectItem>
              {routes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-hide">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/40 text-muted-foreground border-border/40 hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : tripStatusMeta[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip list */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">
            No trips match the current filters.
          </div>
        )}
        {filtered.map((t, i) => {
          const driver = staffUsers.find(u => u.id === t.driverId);
          const supervisor = staffUsers.find(u => u.id === t.supervisorId);
          const isDelayed = t.status === 'delayed';
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                'glass-card p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center',
                isDelayed && 'border-destructive/40',
              )}
            >
              <div className="md:col-span-3 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TripStatusBadge status={t.status} pulse={t.liveTracking} />
                  {t.liveTracking && <Radio className="w-3 h-3 text-success animate-pulse" />}
                </div>
                <div className="font-semibold text-sm truncate">{t.routeName}</div>
                <div className="text-[11px] font-mono text-muted-foreground">{t.id}</div>
              </div>

              <div className="md:col-span-3 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <Bus className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{t.busName}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono truncate">{t.busReg}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-muted-foreground">Departure</div>
                <div className="font-mono text-sm font-semibold">{t.actualDeparture ?? t.departureTime}</div>
                <div className="text-[10px] text-muted-foreground">ETA {t.expectedArrival}</div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono">{t.progressPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${t.progressPercent}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 truncate">
                  Driver · {driver?.name ?? '—'}
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-1.5 md:justify-end">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/staff/trip/${t.id}`}>Open <ChevronRight className="w-3.5 h-3.5" /></Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setOverrideTripId(t.id); setOverrideStatus(t.status); }}
                >
                  Override
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Override dialog */}
      <Dialog open={!!overrideTripId} onOpenChange={(o) => !o && setOverrideTripId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual status override</DialogTitle>
            <DialogDescription>
              Force a status change for <span className="font-mono text-foreground">{overrideTrip?.id}</span>.
              Use only when on-the-ground staff cannot update the trip.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-2">
            {(['scheduled', 'boarding', 'in_transit', 'delayed', 'arrived'] as TripStatus[]).map(s => (
              <button key={s}
                onClick={() => setOverrideStatus(s)}
                className={cn(
                  'p-3 rounded-lg border-2 text-sm font-semibold transition-all',
                  overrideStatus === s
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground',
                )}
              >
                {tripStatusMeta[s].label}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideTripId(null)}>Cancel</Button>
            <Button onClick={applyOverride}>Apply Override</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: { icon: typeof Bus; label: string; value: number; tone: string }) {
  return (
    <div className="glass-card p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${tone}`} />
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
