import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Clock, Users, ArrowRight, Radio, MapPin } from 'lucide-react';
import { Trip, staffUsers } from '@/data/tripOpsData';
import { Button } from '@/components/ui/button';
import TripStatusBadge from './TripStatusBadge';

export default function TripCard({ trip, index = 0 }: { trip: Trip; index?: number }) {
  const driver = staffUsers.find(u => u.id === trip.driverId);
  const supervisor = staffUsers.find(u => u.id === trip.supervisorId);
  const occupancy = Math.round((trip.bookedSeats / trip.totalSeats) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card p-5 card-hover"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <TripStatusBadge status={trip.status} pulse={trip.status === 'in_transit' || trip.status === 'delayed'} />
            {trip.liveTracking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                <Radio className="w-3 h-3 animate-pulse" /> Live
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {trip.from} <ArrowRight className="inline w-4 h-4 mx-1 text-muted-foreground" /> {trip.to}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{trip.id}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-muted-foreground">Departs</div>
          <div className="font-mono text-base font-semibold text-foreground">{trip.departureTime}</div>
          <div className="text-[11px] text-muted-foreground">ETA {trip.expectedArrival}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground min-w-0">
          <Bus className="w-4 h-4 text-accent shrink-0" />
          <div className="min-w-0">
            <div className="text-foreground font-medium truncate">{trip.busName}</div>
            <div className="text-[11px] truncate">{trip.busReg}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4 text-accent shrink-0" />
          <div>
            <div className="text-foreground font-medium">{trip.bookedSeats}/{trip.totalSeats} seats</div>
            <div className="text-[11px]">{occupancy}% occupancy</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent shrink-0" />
          <div className="text-[11px]">
            <div className="text-foreground font-medium">{trip.coachType}</div>
            <div>৳ {trip.fare}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 text-accent shrink-0" />
          <div className="text-[11px]">
            <div className="text-foreground font-medium">Driver</div>
            <div className="truncate">{driver?.name ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Mini progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
          <span>Progress</span>
          <span className="font-mono">{trip.progressPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${trip.progressPercent}%` }}
          />
        </div>
      </div>

      <Button asChild className="w-full" size="lg">
        <Link to={`/staff/trip/${trip.id}`}>
          Open Trip Control
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>

      {supervisor && (
        <p className="text-[11px] text-muted-foreground mt-2.5 text-center">
          Supervisor · {supervisor.name}
        </p>
      )}
    </motion.div>
  );
}
