import { motion } from 'framer-motion';
import { ChevronRight, Clock, MapPin, Pin } from 'lucide-react';
import { type Notice, noticeTypeConfig, noticePriorityConfig } from '@/data/noticeData';

interface Props {
  notice: Notice;
  index?: number;
  onClick?: (notice: Notice) => void;
}

export default function TravelUpdateCard({ notice, index = 0, onClick }: Props) {
  const tCfg = noticeTypeConfig[notice.type];
  const pCfg = noticePriorityConfig[notice.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <button
        onClick={() => onClick?.(notice)}
        className={`block w-full text-left glass-card p-5 card-hover group border ${tCfg.border} transition-all`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${tCfg.bg} ${tCfg.color}`}>
                {tCfg.label}
              </span>
              {notice.priority !== 'normal' && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${pCfg.bg} ${pCfg.color}`}>
                  {pCfg.label}
                </span>
              )}
              {notice.isPinned && (
                <Pin className="w-3 h-3 text-accent" />
              )}
            </div>
            <h3 className="font-display font-semibold text-sm md:text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
              {notice.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{notice.summary}</p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              {notice.route && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {notice.route}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
        </div>
      </button>
    </motion.div>
  );
}
