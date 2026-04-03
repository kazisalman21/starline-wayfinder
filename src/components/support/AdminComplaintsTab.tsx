import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Eye, UserCheck, Play, CheckCircle2, XCircle, ArrowUpRight,
  AlertTriangle, Clock, TrendingUp, MessageCircle, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  useSupportStore, complaintStatuses, complaintCategories, complaintPriorities,
  starlineRoutes, staffMembers, type Complaint, type ComplaintStatus,
} from '@/data/supportData';

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

export default function AdminComplaintsTab() {
  const { complaints, updateComplaint } = useSupportStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (search && !c.complaintId.toLowerCase().includes(search.toLowerCase()) &&
      !c.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: 'Total', value: complaints.length, icon: MessageCircle, color: 'text-primary' },
    { label: 'Open', value: complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'High Priority', value: complaints.filter((c) => ['High', 'Critical'].includes(c.priority)).length, icon: TrendingUp, color: 'text-red-400' },
    { label: 'Resolved Today', value: complaints.filter((c) => c.status === 'Resolved').length, icon: CheckCircle2, color: 'text-green-400' },
  ];

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, {
      status,
      updatedAt: new Date().toISOString(),
      timeline: [...(complaints.find((c) => c.id === id)?.timeline || []), {
        id: `t${Date.now()}`, status, note: `Status changed to ${status}`, by: 'Admin', at: new Date().toISOString(),
      }],
    });
  };

  const handleAssign = (id: string, staff: string) => {
    updateComplaint(id, {
      assignedStaff: staff,
      status: 'Assigned',
      updatedAt: new Date().toISOString(),
      timeline: [...(complaints.find((c) => c.id === id)?.timeline || []), {
        id: `t${Date.now()}`, status: 'Assigned', note: `Assigned to ${staff}`, by: 'Admin', at: new Date().toISOString(),
      }],
    });
    setShowAssign(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 card-hover">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search complaints..." className="pl-9 bg-secondary/50 border-border/40" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" /> Filters
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-3 glass-card p-4">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Status</label>
              <select className="h-9 rounded-md border border-input bg-secondary/50 px-3 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                {complaintStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
              <select className="h-9 rounded-md border border-input bg-secondary/50 px-3 text-xs" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All</option>
                {complaintCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Priority</label>
              <select className="h-9 rounded-md border border-input bg-secondary/50 px-3 text-xs" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All</option>
                {complaintPriorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Route</TableHead>
              <TableHead className="text-muted-foreground hidden lg:table-cell">Category</TableHead>
              <TableHead className="text-muted-foreground">Priority</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground hidden lg:table-cell">Assigned</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-secondary/20">
                <TableCell className="font-mono text-xs text-primary">{c.complaintId}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{c.customerName}</div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">{c.route}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs">{c.category}</TableCell>
                <TableCell><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle[c.priority]}`}>{c.priority}</span></TableCell>
                <TableCell><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[c.status]}`}>{c.status}</span></TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{c.assignedStaff || '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(c)}><Eye className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAssign(c.id)}><UserCheck className="w-3.5 h-3.5" /></Button>
                    {!['Resolved', 'Closed'].includes(c.status) && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-green-400" onClick={() => handleStatusChange(c.id, 'Resolved')}><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="glass-card border-border/40 max-w-3xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-3 flex-wrap">
                  <span className="text-primary">{selected.complaintId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[selected.status]}`}>{selected.status}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle[selected.priority]}`}>{selected.priority}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Customer Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Customer', value: selected.customerName },
                    { label: 'Phone', value: selected.phone },
                    { label: 'Route', value: selected.route },
                    { label: 'Counter', value: selected.boardingCounter },
                    { label: 'Travel Date', value: selected.travelDate },
                    { label: 'Category', value: selected.category },
                    { label: 'Assigned', value: selected.assignedStaff || 'Unassigned' },
                    { label: 'Submitted', value: new Date(selected.createdAt).toLocaleDateString() },
                  ].map((item, i) => (
                    <div key={i} className="bg-secondary/30 rounded-xl p-3">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      <p className="font-medium text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                {selected.aiSummary && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="text-xs text-primary font-medium uppercase tracking-wider mb-2">🤖 AI Summary</h4>
                    <p className="text-sm leading-relaxed">{selected.aiSummary}</p>
                  </div>
                )}

                {/* Details */}
                <div className="bg-secondary/20 rounded-xl p-4">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Original Complaint</h4>
                  <p className="text-sm leading-relaxed">{selected.details}</p>
                </div>

                {/* Internal Notes */}
                {selected.internalNotes && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-2">📝 Internal Notes</h4>
                    <p className="text-sm leading-relaxed">{selected.internalNotes}</p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Status Timeline</h4>
                  <div className="space-y-0">
                    {selected.timeline.map((t, i) => (
                      <div key={t.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === selected.timeline.length - 1 ? 'bg-primary' : 'bg-border'}`} />
                          {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-border/40 my-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 flex-wrap">
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

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
                  <Button size="sm" variant="outline" onClick={() => setShowAssign(selected.id)}><UserCheck className="w-3.5 h-3.5 mr-1" /> Assign</Button>
                  {!['Resolved', 'Closed'].includes(selected.status) && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { handleStatusChange(selected.id, 'In Progress'); setSelected({ ...selected, status: 'In Progress' }); }}><Play className="w-3.5 h-3.5 mr-1" /> In Progress</Button>
                      <Button size="sm" variant="outline" className="text-green-400 hover:text-green-300" onClick={() => { handleStatusChange(selected.id, 'Resolved'); setSelected({ ...selected, status: 'Resolved' }); }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolve</Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300"><ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Escalate</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={!!showAssign} onOpenChange={() => setShowAssign(null)}>
        <DialogContent className="glass-card border-border/40 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Assign Staff</DialogTitle>
            <DialogDescription>Select a staff member to handle this complaint.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {staffMembers.map((staff) => (
              <button key={staff} onClick={() => showAssign && handleAssign(showAssign, staff)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/30">
                {staff}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
