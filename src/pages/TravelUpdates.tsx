import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, SortAsc, SortDesc, ArrowUpDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/notices/AnnouncementBar';
import TravelUpdateCard from '@/components/notices/TravelUpdateCard';
import NoticeFilterTabs from '@/components/notices/NoticeFilterTabs';
import NoticeDetailDrawer from '@/components/notices/NoticeDetailDrawer';
import { useNoticeStore, getActiveNotices, noticeTypes, noticeTypeConfig, sortByPriority, type Notice, type NoticeType } from '@/data/noticeData';
import { Input } from '@/components/ui/input';

const filterTabs = ['All', ...noticeTypes.map((t) => noticeTypeConfig[t].label)];

type SortOption = 'latest' | 'oldest' | 'priority';

export default function TravelUpdates() {
  const { notices } = useNoticeStore();
  const active = getActiveNotices(notices);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Map label back to type key
  const typeFromLabel = (label: string): NoticeType | null => {
    const entry = Object.entries(noticeTypeConfig).find(([, v]) => v.label === label);
    return entry ? (entry[0] as NoticeType) : null;
  };

  const filtered = useMemo(() => {
    let list = filter === 'All' ? active : active.filter((n) => noticeTypeConfig[n.type].label === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    // Sort
    if (sort === 'priority') return sortByPriority(list);
    const dir = sort === 'latest' ? -1 : 1;
    return [...list].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return dir * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    });
  }, [active, filter, search, sort]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'priority', label: 'Priority' },
  ];

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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Notice Center</h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Service alerts, travel advisories, fare updates, and important announcements from Star Line Group.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Sort */}
      <div className="container mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-border h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {sortOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === s.value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mb-8">
        <NoticeFilterTabs categories={filterTabs} active={filter} onChange={setFilter} />
      </div>

      {/* Notices List */}
      <div className="container pb-20">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notices found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n, i) => (
              <TravelUpdateCard key={n.id} notice={n} index={i} onClick={setSelectedNotice} />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <NoticeDetailDrawer notice={selectedNotice} onClose={() => setSelectedNotice(null)} />

      <Footer />
    </div>
  );
}
