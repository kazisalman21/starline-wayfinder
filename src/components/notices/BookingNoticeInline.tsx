import { AlertTriangle, Info, Megaphone } from 'lucide-react';
import { type Notice, noticeTypeConfig, noticePriorityConfig } from '@/data/noticeData';

interface Props {
  notices: Notice[];
}

export default function BookingNoticeInline({ notices }: Props) {
  if (notices.length === 0) return null;

  return (
    <div className="space-y-2">
      {notices.map((n) => {
        const tCfg = noticeTypeConfig[n.type];
        const Icon = n.priority === 'critical' || n.priority === 'high' ? AlertTriangle : Info;
        return (
          <div key={n.id} className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${tCfg.border} ${tCfg.bg}`}>
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tCfg.color}`} />
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
