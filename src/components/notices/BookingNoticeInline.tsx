import { AlertTriangle, Info, Megaphone } from 'lucide-react';
import { type Notice } from '@/data/noticeData';

interface Props {
  notices: Notice[];
}

const icons = {
  urgent: AlertTriangle,
  high: AlertTriangle,
  medium: Info,
  low: Megaphone,
};

const styles = {
  urgent: 'border-red-500/30 bg-red-500/10 text-red-300',
  high: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  medium: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  low: 'border-border bg-secondary/50 text-muted-foreground',
};

export default function BookingNoticeInline({ notices }: Props) {
  if (notices.length === 0) return null;

  return (
    <div className="space-y-2">
      {notices.map((n) => {
        const Icon = icons[n.priority];
        return (
          <div key={n.id} className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${styles[n.priority]}`}>
            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-medium">{n.title}</span>
              {n.summary && <p className="text-xs opacity-80 mt-0.5">{n.summary}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
