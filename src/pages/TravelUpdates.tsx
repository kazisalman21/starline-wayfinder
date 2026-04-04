import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronLeft, Clock, MapPin, Building2, AlertTriangle, Headphones, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/notices/AnnouncementBar';
import TravelUpdateCard from '@/components/notices/TravelUpdateCard';
import NoticeFilterTabs from '@/components/notices/NoticeFilterTabs';
import { useNoticeStore, getActiveNotices, noticeCategories, priorityConfig, categoryConfig, type Notice } from '@/data/noticeData';
import { Input } from '@/components/ui/input';

const filterTabs = ['All', ...noticeCategories];

export default function TravelUpdates() {
  const { id } = useParams();
  const { notices } = useNoticeStore();
  const active = getActiveNotices(notices);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = filter === 'All' ? active : active.filter((n) => n.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }, [active, filter, search]);

  // Detail view
  if (id) {
    const notice = notices.find((n) => n.id === id);
    if (!notice) return <div className="min-h-screen bg-background"><Navbar /><div className="pt-24 container text-center text-muted-foreground">Notice not found.</div><Footer /></div>;
    return <NoticeDetail notice={notice} />;
  }

  const urgentNotice = active.find((n) => n.priority === 'urgent');

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Travel Updates</h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Stay informed about service alerts, route advisories, schedule changes, and important travel notices from Star Line.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Urgent Banner */}
      {urgentNotice && (
        <div className="container mb-6">
          <Link
            to={`/notices/${urgentNotice.id}`}
            className="block glass-card-elevated border border-red-500/30 bg-red-500/5 p-5 rounded-2xl card-hover group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1 block">⚠ Urgent Alert</span>
                <h3 className="font-display font-semibold text-sm md:text-base group-hover:text-red-300 transition-colors">{urgentNotice.title}</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400/50 group-hover:text-red-400 flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}

      {/* Filters + Search */}
      <div className="container mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <NoticeFilterTabs categories={filterTabs} active={filter} onChange={setFilter} />
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-border h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="container pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No active notices</p>
            <p className="text-sm mt-1">All services are running normally.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((n, i) => (
              <TravelUpdateCard key={n.id} notice={n} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function NoticeDetail({ notice }: { notice: Notice }) {
  const pCfg = priorityConfig[notice.priority];
  const cCfg = categoryConfig[notice.category];

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl">
          <Link to="/notices" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Travel Updates
          </Link>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header Card */}
            <div className={`glass-card-elevated border ${pCfg.bg} p-6 md:p-8 rounded-2xl mb-6`}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xl">{cCfg.icon}</span>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${cCfg.color}`}>{notice.category}</span>
                {(notice.priority === 'urgent' || notice.priority === 'high') && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    notice.priority === 'urgent' ? 'text-red-400 bg-red-500/10' : 'text-orange-400 bg-orange-500/10'
                  }`}>
                    {pCfg.label}
                  </span>
                )}
              </div>
              <h1 className="font-display text-xl md:text-2xl font-bold mb-3">{notice.title}</h1>
              <p className="text-sm text-muted-foreground mb-5">{notice.summary}</p>
              <div className="flex items-center gap-4 text-[12px] text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Published {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  Valid until {new Date(notice.activeUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="glass-card p-6 md:p-8 rounded-2xl mb-6">
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{notice.content}</p>
            </div>

            {/* Affected */}
            {(notice.affectedRoutes.length > 0 || notice.affectedCounters.length > 0) && (
              <div className="glass-card p-6 rounded-2xl mb-6">
                <h3 className="font-display font-semibold text-sm mb-4">Affected Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {notice.affectedRoutes.map((r) => (
                    <div key={r} className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg px-3 py-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {r}
                    </div>
                  ))}
                  {notice.affectedCounters.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg px-3 py-2">
                      <Building2 className="w-3.5 h-3.5 text-accent" /> {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support CTA */}
            <div className="glass-card p-6 rounded-2xl text-center">
              <Headphones className="w-8 h-8 mx-auto text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground mb-4">Our support team is available 24/7 to help.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to="/support" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Chat with Star Line Care
                </Link>
                <Link to="/support" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors border border-border">
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
