import { useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, AlertTriangle, Star } from 'lucide-react';
import { Trip, useTripOpsStore } from '@/data/tripOpsData';
import { toast } from 'sonner';

export default function MarkArrivedDialog({
  open, onOpenChange, trip,
}: { open: boolean; onOpenChange: (o: boolean) => void; trip: Trip }) {
  const markArrived = useTripOpsStore(s => s.markArrived);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      markArrived(trip.id);
      toast.success('Trip marked as arrived', {
        description: `${trip.routeName} · ${trip.busName}`,
      });
      setConfirming(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-border/60">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <AlertDialogTitle className="text-xl">Mark trip as arrived?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            This will mark <span className="text-foreground font-semibold">{trip.busName}</span> as
            having reached <span className="text-foreground font-semibold">{trip.to}</span>. This
            action cannot be done accidentally — please confirm only when the bus has fully arrived.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2.5 py-2">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/40">
            <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-foreground">GPS Confirmation</div>
              <div className="text-muted-foreground">
                Last position near <span className="text-foreground">{trip.stops.find(s => s.status === 'current')?.name ?? trip.to}</span>
                {' · '}signal: {trip.gpsSignal}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/40">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              Live tracking will stop and passengers will be moved toward trip completion.
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/40 border border-border/40">
            <Star className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              Passengers will be invited to rate this trip after arrival.
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={confirming}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm} disabled={confirming} size="lg">
              {confirming ? 'Confirming…' : 'Confirm Arrival'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
