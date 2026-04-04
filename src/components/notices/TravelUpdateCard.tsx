import { motion } from 'framer-motion';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Notice, priorityConfig, categoryConfig } from '@/data/noticeData';

interface Props {
  notice: Notice;
  index?: number;
}

export default function TravelUpdateCard({ notice, index = 0 }: Props) {
  const pCfg = priorityConfig[notice.priority];
  const cCfg = categoryConfig[notice.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={`/notices/${notice.id}`}
        className={`block glass-card p-5 card-hover group border ${pCfg.bg} transition-all`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{cCfg.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${cCfg.color}`}>
                {notice.category}
              </span>
              {notice.priority === 'urgent' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                  Urgent
                </span>
              )}
              {notice.priority === 'high' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  High Priority
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-sm md:text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
              {notice.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{notice.summary}</p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              {notice.affectedRoutes.length > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {notice.affectedRoutes[0]}
                  {notice.affectedRoutes.length > 1 && ` +${notice.affectedRoutes.length - 1}`}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
