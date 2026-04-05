import { X, Clock, MapPin, Building2, Share2, ExternalLink, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { type Notice, noticeTypeConfig, noticePriorityConfig, sortByPriority, getActiveNotices, useNoticeStore } from '@/data/noticeData';

interface Props {
  notice: Notice | null;
  onClose: () => void;
}

export default function NoticeDetailDrawer({ notice, onClose }: Props) {
  const { notices } = useNoticeStore();

  const related = notice
    ? sortByPriority(getActiveNotices(notices))
        .filter((n) => n.id !== notice.id && n.type === notice.type)
        .slice(0, 2)
    : [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/notices?id=${notice?.id}`);
  };

  return (
    <AnimatePresence>
      {notice && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-lg bg-background border-l border-border overflow-y-auto"
          >
            {/* Type color strip */}
            <div className={`h-1 ${noticeTypeConfig[notice.type].bg.replace('/10', '')}`} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${noticeTypeConfig[notice.type].bg} ${noticeTypeConfig[notice.type].color}`}>
                    {noticeTypeConfig[notice.type].label}
                  </span>
                  {notice.priority !== 'normal' && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${noticePriorityConfig[notice.priority].bg} ${noticePriorityConfig[notice.priority].color}`}>
                      {noticePriorityConfig[notice.priority].label}
                    </span>
                  )}
                  {notice.isPinned && <Pin className="w-3 h-3 text-accent" />}
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h2 className="font-display text-xl font-bold mb-4 leading-tight">{notice.title}</h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Published {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {notice.expiresAt && (
                  <span className="flex items-center gap-1">
                    Expires {new Date(notice.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                )}
                {notice.updatedAt && notice.updatedAt !== notice.publishedAt && (
                  <span className="text-muted-foreground/60">
                    Updated {new Date(notice.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="glass-card p-5 rounded-xl mb-6">
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{notice.body}</p>
              </div>

              {/* Tags */}
              {(notice.route || notice.counter) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {notice.route && (
                    <span className="flex items-center gap-1.5 text-xs bg-secondary/60 rounded-lg px-3 py-1.5">
                      <MapPin className="w-3 h-3 text-primary" /> {notice.route}
                    </span>
                  )}
                  {notice.counter && (
                    <span className="flex items-center gap-1.5 text-xs bg-secondary/60 rounded-lg px-3 py-1.5">
                      <Building2 className="w-3 h-3 text-accent" /> {notice.counter}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mb-8">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyLink}>
                  <Share2 className="w-3.5 h-3.5" /> Copy Link
                </Button>
              </div>

              {/* CTA */}
              {notice.cta && (
                <Link
                  to={notice.cta.href}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors mb-8 ${noticeTypeConfig[notice.type].bg} ${noticeTypeConfig[notice.type].color} hover:opacity-80`}
                >
                  {notice.cta.label} <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Related Notices</h4>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          // Trigger re-render with new notice — parent handles state
                        }}
                        className="block w-full text-left glass-card p-4 rounded-xl hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-bold uppercase ${noticeTypeConfig[r.type].color}`}>{noticeTypeConfig[r.type].label}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-1">{r.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {new Date(r.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
