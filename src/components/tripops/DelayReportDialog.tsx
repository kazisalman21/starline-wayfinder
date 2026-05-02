import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { delayReasons, Trip, useTripOpsStore } from '@/data/tripOpsData';
import { toast } from 'sonner';

export default function DelayReportDialog({
  open, onOpenChange, trip,
}: { open: boolean; onOpenChange: (o: boolean) => void; trip: Trip }) {
  const reportDelay = useTripOpsStore(s => s.reportDelay);
  const [reason, setReason] = useState(delayReasons[0]);
  const [note, setNote] = useState('');
  const [minutes, setMinutes] = useState(15);

  const submit = () => {
    if (!reason) return;
    reportDelay(trip.id, { reason, note, estimatedMinutes: minutes });
    toast.warning(`Delay reported · +${minutes} min`, { description: reason });
    onOpenChange(false);
    setNote('');
    setMinutes(15);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/60">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center mb-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle>Report a delay</DialogTitle>
          <DialogDescription>
            Notify the control room and passengers of an updated arrival estimate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {delayReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Estimated delay (minutes)
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 60].map(m => (
                <Button
                  key={m}
                  type="button"
                  variant={minutes === m ? 'default' : 'outline'}
                  onClick={() => setMinutes(m)}
                >
                  +{m}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              value={minutes}
              onChange={e => setMinutes(Math.max(1, Number(e.target.value) || 0))}
              className="mt-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Note (optional)</Label>
            <Textarea
              placeholder="Add context for the control room…"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Submit Delay Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
