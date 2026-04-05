import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, Megaphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNoticeStore, getBarNotices, noticeTypeConfig, type Notice } from '@/data/noticeData';

export default function AnnouncementBar() {
  const { notices, dismissedBarIds, dismissBar } = useNoticeStore();
  const barNotices = getBarNotices(notices).filter((n) => !dismissedBarIds.includes(n.id));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (barNotices.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % barNotices.length), 4000);
    return () => clearInterval(t);
  }, [barNotices.length]);

  if (barNotices.length === 0) return null;

  const notice = barNotices[current % barNotices.length];
  if (!notice) return null;

  const tCfg = noticeTypeConfig[notice.type];
  const isCritical = notice.priority === 'critical';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notice.id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        className={`relative z-[60] ${
          isCritical
            ? 'bg-red-600/90 text-white border-l-4 border-red-400'
            : 'bg-card/90 backdrop-blur-xl border-b border-border/30 text-foreground'
        }`}
      >
        <div className="container flex items-center justify-between gap-3 py-2 text-[13px]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {isCritical ? (
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
            ) : (
              <Info className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${tCfg.bg} ${tCfg.color} flex-shrink-0`}>
              {tCfg.label}
            </span>
            <span className="truncate font-medium">{notice.title}</span>
            {notice.cta && (
              <Link
                to={notice.cta.href}
                className="hidden sm:inline-flex items-center gap-0.5 font-semibold underline underline-offset-2 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                {notice.cta.label} <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {barNotices.length > 1 && (
              <span className="text-[11px] opacity-60">
                {(current % barNotices.length) + 1}/{barNotices.length}
              </span>
            )}
            {!isCritical && (
              <button
                onClick={() => dismissBar(notice.id)}
                className="p-0.5 rounded hover:bg-secondary/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
