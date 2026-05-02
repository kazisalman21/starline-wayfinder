import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Calendar, User, Shield, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripOpsStore } from '@/data/tripOpsData';
import TripCard from '@/components/tripops/TripCard';
import starlineLogo from '@/assets/starline-logo.png';

export default function StaffTripsToday() {
  const nav = useNavigate();
  const { currentUser, logout, tripsForUser, trips } = useTripOpsStore();

  useEffect(() => {
    if (!currentUser) nav('/staff/login');
  }, [currentUser, nav]);

  if (!currentUser) return null;

  const myTrips = currentUser.role === 'admin' ? trips : tripsForUser(currentUser.id);
  const active = myTrips.filter(t => t.status !== 'arrived');
  const completed = myTrips.filter(t => t.status === 'arrived');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={starlineLogo} alt="Star Line" className="h-8 w-auto shrink-0" />
            <div className="hidden sm:block min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-accent font-semibold leading-tight">Staff Portal</div>
              <div className="text-sm font-semibold text-foreground truncate">Today's Assigned Trips</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/60 border border-border/40">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-xs leading-tight">
                <div className="font-semibold text-foreground">{currentUser.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-accent">{currentUser.role}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); nav('/staff/login'); }}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-8">
        {/* Welcome + summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hello, <span className="text-gradient-primary">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have {active.length} active trip{active.length === 1 ? '' : 's'} today.
          </p>
        </motion.div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Kpi icon={Bus} label="Active" value={active.length} tone="text-success" />
          <Kpi icon={Shield} label="Delayed" value={myTrips.filter(t => t.status === 'delayed').length} tone="text-destructive" />
          <Kpi icon={User} label="Completed" value={completed.length} tone="text-muted-foreground" />
        </div>

        {/* Active trips */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active</h2>
            <span className="text-xs text-muted-foreground">{active.length} trips</span>
          </div>
          {active.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Bus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active trips assigned for today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {active.map((t, i) => <TripCard key={t.id} trip={t} index={i} />)}
            </div>
          )}
        </section>

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Completed today</h2>
              <span className="text-xs text-muted-foreground">{completed.length} trips</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completed.map((t, i) => <TripCard key={t.id} trip={t} index={i} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Bus; label: string; value: number; tone: string }) {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <Icon className={`w-4 h-4 ${tone}`} />
        <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{value}</span>
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
