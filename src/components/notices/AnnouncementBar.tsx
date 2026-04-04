import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, Megaphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNoticeStore, getTopBarNotices, type Notice, type NoticePriority } from '@/data/noticeData';

const priorityStyles: Record<NoticePriority, string> = {
  urgent: 'bg-destructive/90 text-white',
  high: 'bg-orange-600/80 text-white',
  medium: 'bg-primary/80 text-primary-foreground',
  low: 'bg-secondary text-secondary-foreground',
};

const priorityIcon: Record<NoticePriority, typeof AlertTriangle> = {
  urgent: AlertTriangle,
  high: AlertTriangle,
  medium: Info,
  low: Megaphone,
};

export default function AnnouncementBar() {
  const { notices, dismissedBannerIds, dismissBanner } = useNoticeStore();
  const activeBarNotices = getTopBarNotices(notices).filter(
    (n) => !dismissedBannerIds.includes(n.id)
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeBarNotices.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % activeBarNotices.length), 6000);
    return () => clearInterval(t);
  }, [activeBarNotices.length]);

  if (activeBarNotices.length === 0) return null;

  const notice = activeBarNotices[current % activeBarNotices.length];
  if (!notice) return null;
  const Icon = priorityIcon[notice.priority];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notice.id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        className={`relative z-[60] ${priorityStyles[notice.priority]}`}
      >
        <div className="container flex items-center justify-between gap-3 py-2 text-[13px]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate font-medium">{notice.title}</span>
            {notice.ctaLink && (
              <Link
                to={notice.ctaLink}
                className="hidden sm:inline-flex items-center gap-0.5 font-semibold underline underline-offset-2 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                {notice.ctaText || 'Learn more'} <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeBarNotices.length > 1 && (
              <span className="text-[11px] opacity-70">
                {(current % activeBarNotices.length) + 1}/{activeBarNotices.length}
              </span>
            )}
            <button
              onClick={() => dismissBanner(notice.id)}
              className="p-0.5 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
