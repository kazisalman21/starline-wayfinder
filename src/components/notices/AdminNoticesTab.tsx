import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, Search, X, Bell, Globe, Megaphone,
  Clock, MapPin, Check, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useNoticeStore, noticeCategories, noticePriorities, priorityConfig, categoryConfig,
  type Notice, type NoticeCategory, type NoticePriority, type NoticeDisplay, type NoticeStatus
} from '@/data/noticeData';

const displayOptions: { id: NoticeDisplay; label: string }[] = [
  { id: 'banner', label: 'Top Bar' },
  { id: 'card', label: 'Homepage' },
  { id: 'contextual', label: 'Booking Flow' },
  { id: 'dashboard', label: 'User Dashboard' },
  { id: 'support', label: 'Support' },
];

const emptyNotice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', summary: '', content: '', category: 'Service Notice', priority: 'medium',
  status: 'draft', displayTypes: ['card'], activeFrom: '', activeUntil: '',
  affectedRoutes: [], affectedCounters: [], showOnHomepage: true, showInTopBar: false,
  showInBookingFlow: false, showInSupport: false, showInUserDashboard: false, ctaText: '', ctaLink: '',
};

const sampleRoutes = ['Dhaka → Feni', 'Feni → Dhaka', 'Dhaka → Chattogram', 'Chattogram → Dhaka', 'Dhaka → Cox\'s Bazar', 'Cox\'s Bazar → Dhaka', 'Feni → Chittagong'];
const sampleCounters = ['Abdullahpur', 'Maniknagar', 'Mohipal Main', 'Mohipal Flyover', 'Feni Main Terminal', 'Cox\'s Bazar Terminal', 'Chittagong Terminal'];

export default function AdminNoticesTab() {
  const { notices, addNotice, updateNotice, deleteNotice } = useNoticeStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyNotice);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = notices
    .filter((n) => filterStatus === 'all' || n.status === filterStatus)
    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditingNotice(null); setForm(emptyNotice); setDialogOpen(true); };
  const openEdit = (n: Notice) => { setEditingNotice(n); setForm(n); setDialogOpen(true); };
  const openView = (n: Notice) => { setViewingNotice(n); setViewDialogOpen(true); };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (editingNotice) {
      updateNotice(editingNotice.id, { ...form, updatedAt: now });
    } else {
      const newNotice: Notice = {
        ...form,
        id: `NTC-${String(notices.length + 1).padStart(3, '0')}`,
        createdAt: now,
        updatedAt: now,
      };
      addNotice(newNotice);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => { deleteNotice(id); setDeleteConfirm(null); };

  const toggleDisplay = (d: NoticeDisplay) => {
    setForm((f) => ({
      ...f,
      displayTypes: f.displayTypes.includes(d) ? f.displayTypes.filter((x) => x !== d) : [...f.displayTypes, d],
      showInTopBar: d === 'banner' ? !f.displayTypes.includes(d) : f.showInTopBar,
      showOnHomepage: d === 'card' ? !f.displayTypes.includes(d) : f.showOnHomepage,
      showInBookingFlow: d === 'contextual' ? !f.displayTypes.includes(d) : f.showInBookingFlow,
      showInUserDashboard: d === 'dashboard' ? !f.displayTypes.includes(d) : f.showInUserDashboard,
      showInSupport: d === 'support' ? !f.displayTypes.includes(d) : f.showInSupport,
    }));
  };

  const toggleRoute = (r: string) => {
    setForm((f) => ({
      ...f,
      affectedRoutes: f.affectedRoutes.includes(r) ? f.affectedRoutes.filter((x) => x !== r) : [...f.affectedRoutes, r],
    }));
  };
  const toggleCounter = (c: string) => {
    setForm((f) => ({
      ...f,
      affectedCounters: f.affectedCounters.includes(c) ? f.affectedCounters.filter((x) => x !== c) : [...f.affectedCounters, c],
    }));
  };

  // Stats
  const published = notices.filter((n) => n.status === 'published').length;
  const urgent = notices.filter((n) => n.priority === 'urgent' && n.status === 'published').length;
  const drafts = notices.filter((n) => n.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Notices', value: notices.length, color: 'text-foreground' },
          { label: 'Published', value: published, color: 'text-green-400' },
          { label: 'Urgent Active', value: urgent, color: 'text-red-400' },
          { label: 'Drafts', value: drafts, color: 'text-muted-foreground' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 rounded-xl">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === s ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm bg-secondary/50" />
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Create Notice</Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs">Notice</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Category</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Priority</TableHead>
              <TableHead className="text-xs hidden lg:table-cell">Display</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((n) => {
              const pCfg = priorityConfig[n.priority];
              const cCfg = categoryConfig[n.category];
              return (
                <TableRow key={n.id} className="border-border">
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium text-sm truncate">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground">{n.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`text-xs ${cCfg.color}`}>{cCfg.icon} {n.category}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`text-xs font-medium ${pCfg.color}`}>{pCfg.label}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {n.showInTopBar && <span className="text-[10px] bg-secondary rounded px-1.5 py-0.5">Bar</span>}
                      {n.showOnHomepage && <span className="text-[10px] bg-secondary rounded px-1.5 py-0.5">Home</span>}
                      {n.showInBookingFlow && <span className="text-[10px] bg-secondary rounded px-1.5 py-0.5">Booking</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full ${
                      n.status === 'published' ? 'bg-green-500/15 text-green-400' :
                      n.status === 'draft' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {n.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(n)}><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(n)}><Pencil className="w-3.5 h-3.5" /></Button>
                      {n.status === 'published' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateNotice(n.id, { status: 'archived' })}><X className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                      ) : n.status === 'draft' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateNotice(n.id, { status: 'published' })}><Check className="w-3.5 h-3.5 text-green-400" /></Button>
                      ) : null}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(n.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
          {viewingNotice && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{viewingNotice.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex gap-2 flex-wrap">
                  <span className={`${categoryConfig[viewingNotice.category].color} text-xs font-medium`}>
                    {categoryConfig[viewingNotice.category].icon} {viewingNotice.category}
                  </span>
                  <span className={`${priorityConfig[viewingNotice.priority].color} text-xs font-medium`}>
                    {priorityConfig[viewingNotice.priority].label}
                  </span>
                </div>
                <p className="text-muted-foreground">{viewingNotice.summary}</p>
                <div className="bg-secondary/50 rounded-lg p-4 text-foreground/90 whitespace-pre-line">{viewingNotice.content}</div>
                {viewingNotice.affectedRoutes.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1">Affected Routes</div>
                    <div className="flex flex-wrap gap-1.5">{viewingNotice.affectedRoutes.map((r) => <span key={r} className="text-xs bg-secondary rounded px-2 py-1">{r}</span>)}</div>
                  </div>
                )}
                {viewingNotice.affectedCounters.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1">Affected Counters</div>
                    <div className="flex flex-wrap gap-1.5">{viewingNotice.affectedCounters.map((c) => <span key={c} className="text-xs bg-secondary rounded px-2 py-1">{c}</span>)}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Create Notice'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary/50" />
            </div>
            {/* Summary */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Short Summary</label>
              <Input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="bg-secondary/50" />
            </div>
            {/* Content */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Description</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Category + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as NoticeCategory })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  {noticeCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as NoticePriority })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  {noticePriorities.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
              </div>
            </div>

            {/* Status + Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as NoticeStatus })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Active From</label>
                <Input type="datetime-local" value={form.activeFrom.slice(0, 16)} onChange={(e) => setForm({ ...form, activeFrom: e.target.value })} className="bg-secondary/50 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Active Until</label>
                <Input type="datetime-local" value={form.activeUntil.slice(0, 16)} onChange={(e) => setForm({ ...form, activeUntil: e.target.value })} className="bg-secondary/50 text-xs" />
              </div>
            </div>

            {/* Display locations */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Display Locations</label>
              <div className="flex flex-wrap gap-2">
                {displayOptions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => toggleDisplay(d.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.displayTypes.includes(d.id) ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affected Routes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Affected Routes</label>
              <div className="flex flex-wrap gap-1.5">
                {sampleRoutes.map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleRoute(r)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                      form.affectedRoutes.includes(r) ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Affected Counters */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Affected Counters</label>
              <div className="flex flex-wrap gap-1.5">
                {sampleCounters.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCounter(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                      form.affectedCounters.includes(c) ? 'bg-accent/10 text-accent border-accent/30' : 'bg-secondary/50 text-muted-foreground border-border'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CTA Text (optional)</label>
                <Input value={form.ctaText || ''} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="e.g. Book Now" className="bg-secondary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CTA Link (optional)</label>
                <Input value={form.ctaLink || ''} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="e.g. /search" className="bg-secondary/50" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>
              {editingNotice ? 'Save Changes' : 'Create Notice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
