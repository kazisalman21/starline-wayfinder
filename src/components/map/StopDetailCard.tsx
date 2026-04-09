import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ArrowUpRight, X } from 'lucide-react';
import type { MapStop } from './MapCanvas';

interface StopDetailCardProps {
  stop: MapStop;
  arrivalTime?: string;
  departureTime?: string;
  boardingAllowed?: boolean;
  droppingAllowed?: boolean;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  terminal: 'Main Terminal',
  counter: 'Counter',
  boarding: 'Boarding Point',
  dropping: 'Dropping Point',
  break: 'Rest / Break Stop',
  intermediate: 'Intermediate Stop',
};

export default function StopDetailCard({ stop, arrivalTime, departureTime, boardingAllowed = true, droppingAllowed = false, onClose }: StopDetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="glass-card p-4 w-72"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <div className="font-display font-bold text-sm">{stop.name}</div>
            <div className="text-[10px] text-muted-foreground">{typeLabels[stop.type]}</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary/60 text-muted-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {arrivalTime && (
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Arrival:</span>
            <span className="font-medium">{arrivalTime}</span>
          </div>
        )}
        {departureTime && (
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Departure:</span>
            <span className="font-medium">{departureTime}</span>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          {boardingAllowed && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
              Boarding
            </span>
          )}
          {droppingAllowed && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/20">
              Dropping
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
