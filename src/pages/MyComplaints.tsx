import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, ChevronRight, Clock, AlertTriangle, CheckCircle2,
  Eye, MessageCircle, Calendar, MapPin, Phone, Mail, ArrowUpRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupportStore, complaintStatuses, type Complaint, type ComplaintStatus } from '@/data/supportData';

const statusStyle: Record<ComplaintStatus, string> = {
  'Submitted': 'bg-blue-500/15 text-blue-400',
  'Under Review': 'bg-amber-500/15 text-amber-400',
  'Assigned': 'bg-purple-500/15 text-purple-400',
  'In Progress': 'bg-accent/15 text-accent',
  'Resolved': 'bg-green-500/15 text-green-400',
  'Closed': 'bg-muted-foreground/15 text-muted-foreground',
};

const priorityStyle: Record<string, string> = {
  'Low': 'bg-muted-foreground/15 text-muted-foreground',
  'Medium': 'bg-blue-500/15 text-blue-400',
  'High': 'bg-amber-500/15 text-amber-400',
  'Critical': 'bg-red-500/15 text-red-400',
};

export default function MyComplaints() {
  const complaints = useSupportStore((s) => s.complaints);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Complaint | null>(null);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.complaintId.toLowerCase().includes(search.toLowerCase()) &&
      !c.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">My Complaints</h1>
              <p className="text-sm text-muted-foreground mt-1">{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} filed</p>
            </div>
            <Button className="btn-primary-glow" onClick={() => window.location.href = '/support'}>
              <MessageCircle className="w-4 h-4 mr-1" /> New Complaint
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by complaint ID or name..." className="pl-9 bg-secondary/50 border-border/40" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                All
              </button>
              {complaintStatuses.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Complaint List */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="glass-card p-12 text-center">
                <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No complaints found</p>
              </div>
            )}
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card p-4 md:p-5 card-hover cursor-pointer group" onClick={() => setSelected(c)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-primary font-medium">{c.complaintId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[c.status]}`}>{c.status}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle[c.priority]}`}>{c.priority}</span>
                    </div>
                    <p className="text-sm font-medium mb-1 truncate">{c.category}: {c.details.slice(0, 80)}...</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.route}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="glass-card border-border/40 max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-3">
                  <span className="text-primary">{selected.complaintId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Summary Card */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-secondary/30 rounded-xl p-3">
                    <span className="text-xs text-muted-foreground">Category</span>
                    <p className="font-medium mt-0.5">{selected.category}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3">
                    <span className="text-xs text-muted-foreground">Priority</span>
                    <p className="font-medium mt-0.5">{selected.priority}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3">
                    <span className="text-xs text-muted-foreground">Route</span>
                    <p className="font-medium mt-0.5">{selected.route}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3">
                    <span className="text-xs text-muted-foreground">Counter</span>
                    <p className="font-medium mt-0.5">{selected.boardingCounter}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-secondary/20 rounded-xl p-4">
                  <h4 className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Complaint Details</h4>
                  <p className="text-sm leading-relaxed">{selected.details}</p>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Status Timeline</h4>
                  <div className="space-y-0">
                    {selected.timeline.map((t, i) => (
                      <div key={t.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === selected.timeline.length - 1 ? 'bg-primary' : 'bg-border'}`} />
                          {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-border/40 my-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[t.status]}`}>{t.status}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(t.at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-foreground/80 mt-1">{t.note}</p>
                          <span className="text-[10px] text-muted-foreground">by {t.by}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
