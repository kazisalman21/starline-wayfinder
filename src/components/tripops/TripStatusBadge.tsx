import { tripStatusMeta, TripStatus } from '@/data/tripOpsData';
import { cn } from '@/lib/utils';

interface Props {
  status: TripStatus;
  className?: string;
  pulse?: boolean;
}

export default function TripStatusBadge({ status, className, pulse }: Props) {
  const meta = tripStatusMeta[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider',
        meta.tone,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot, pulse && 'animate-pulse')} />
      {meta.label}
    </span>
  );
}
