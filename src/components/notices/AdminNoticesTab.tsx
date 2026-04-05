import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, Search, X, Check, Pin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  useNoticeStore, noticeTypes, noticeTypeConfig, noticePriorityConfig,
  getNoticeStatus, type Notice, type NoticeType, type NoticePriority,
} from '@/data/noticeData';

const sampleRoutes = ['Dhaka → Feni', 'Feni → Dhaka', 'Dhaka → Chattogram', 'Dhaka → Cox\'s Bazar', 'Feni → Chittagong', 'Feni → Lakshmipur'];
const sampleCounters = ['Abdullahpur', 'Maniknagar', 'Feni Main Terminal', 'Cox\'s Bazar Terminal', 'Chittagong Terminal', 'Lakshmipur Terminal'];

const defaultForm = (): Omit<Notice, 'id'> => ({
  title: '', summary: '', body: '', type: 'general', priority: 'normal',
  isPinned: false, isActive: true, showOnHomepage: true, showInBar: false,
  popupOnCritical: false, publishedAt: new Date().toISOString().slice(0, 16),
  expiresAt: null, route: '', counter: '', cta: undefined,
});

export default function AdminNoticesTab() {
  const { notices, addNotice, updateNotice, deleteNotice } = useNoticeStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm());
  const [viewNotice, setViewNotice] = useState<Notice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaHref, setCtaHref] = useState('');

  const filtered = notices
    .filter((n) => statusFilter === 'all' || getNoticeStatus(n) === statusFilter)
    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm());
    setCtaEnabled(false);
    setCtaLabel('');
    setCtaHref('');
    setSheetOpen(true);
  };

  const openEdit = (n: Notice) => {
    setEditingId(n.id);
    setForm(n);
    setCtaEnabled(!!n.cta);
    setCtaLabel(n.cta?.label || '');
    setCtaHref(n.cta?.href || '');
    setSheetOpen(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const cta = ctaEnabled && ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined;
    if (editingId) {
      updateNotice(editingId, { ...form, cta, updatedAt: now });
    } else {
      addNotice({ ...form, id: `NTC-${String(Date.now()).slice(-6)}`, cta, updatedAt: now } as Notice);
    }
    setSheetOpen(false);
  };

  // Stats
  const active = notices.filter((n) => getNoticeStatus(n) === 'active').length;
  const critical = notices.filter((n) => n.priority === 'critical' && n.isActive).length;
  const scheduled = notices.filter((n) => getNoticeStatus(n) === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notices.length, color: 'text-foreground' },
          { label: 'Active', value: active, color: 'text-green-400' },
          { label: 'Critical', value: critical, color: 'text-red-400' },
          { label: 'Scheduled', value: scheduled, color: 'text-blue-400' },
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
          {['all', 'active', 'scheduled', 'expired', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
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
          <Button onClick={openCreate} size="sm" className="gap-1.5 btn-primary-glow">
            <Plus className="w-4 h-4" /> New Notice
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Type</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Priority</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((n) => {
              const tCfg = noticeTypeConfig[n.type];
              const status = getNoticeStatus(n);
              const statusStyles: Record<string, string> = {
                active: 'bg-green-500/15 text-green-400',
                scheduled: 'bg-blue-500/15 text-blue-400',
                expired: 'bg-secondary text-muted-foreground',
                inactive: 'bg-secondary text-muted-foreground',
              };
              return (
                <TableRow key={n.id} className="border-border/20 hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    <div className="max-w-xs flex items-center gap-2">
                      {n.isPinned && <Pin className="w-3 h-3 text-accent flex-shrink-0" />}
                      <div>
                        <div className="font-medium text-sm truncate">{n.title}</div>
                        <div className="text-[11px] text-muted-foreground">{n.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${tCfg.bg} ${tCfg.color}`}>{tCfg.label}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`text-xs font-medium ${noticePriorityConfig[n.priority].color}`}>{noticePriorityConfig[n.priority].label}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full ${statusStyles[status]}`}>{status}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(n.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewNotice(n)}><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(n)}><Pencil className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>Delete Notice</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { deleteConfirm && deleteNotice(deleteConfirm); setDeleteConfirm(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={!!viewNotice} onOpenChange={() => setViewNotice(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
          {viewNotice && (
            <>
              <DialogHeader><DialogTitle className="text-lg">{viewNotice.title}</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${noticeTypeConfig[viewNotice.type].bg} ${noticeTypeConfig[viewNotice.type].color}`}>{noticeTypeConfig[viewNotice.type].label}</span>
                  <span className={`${noticePriorityConfig[viewNotice.priority].color} text-xs font-medium`}>{noticePriorityConfig[viewNotice.priority].label}</span>
                  {viewNotice.isPinned && <span className="text-xs text-accent flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
                </div>
                <p className="text-muted-foreground">{viewNotice.summary}</p>
                <div className="bg-secondary/50 rounded-lg p-4 text-foreground/90 whitespace-pre-line">{viewNotice.body}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-card border-border w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Notice' : 'New Notice'}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Short Summary</label>
              <Input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={5}
                className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as NoticeType })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  {noticeTypes.map((t) => <option key={t} value={t}>{noticeTypeConfig[t].label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as NoticePriority })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Start Date</label>
                <Input type="datetime-local" value={form.publishedAt.slice(0, 16)} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="bg-secondary/50 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">End Date</label>
                <Input type="datetime-local" value={form.expiresAt?.slice(0, 16) || ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value || null })} className="bg-secondary/50 text-xs" />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground block">Visibility</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'isActive', label: 'Active' },
                  { key: 'isPinned', label: 'Pinned' },
                  { key: 'showOnHomepage', label: 'Show on Homepage' },
                  { key: 'showInBar', label: 'Show in Top Bar' },
                  { key: 'popupOnCritical', label: 'Popup (Critical)' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, [key]: !(form as any)[key] })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      (form as any)[key] ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border'
                    }`}
                  >
                    {(form as any)[key] && <Check className="w-3 h-3" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route & Counter */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Route (optional)</label>
                <select
                  value={form.route || ''}
                  onChange={(e) => setForm({ ...form, route: e.target.value || undefined })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  <option value="">None</option>
                  {sampleRoutes.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Counter (optional)</label>
                <select
                  value={form.counter || ''}
                  onChange={(e) => setForm({ ...form, counter: e.target.value || undefined })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm h-10"
                >
                  <option value="">None</option>
                  {sampleCounters.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* CTA */}
            <div>
              <button
                type="button"
                onClick={() => setCtaEnabled(!ctaEnabled)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors mb-2 ${
                  ctaEnabled ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border'
                }`}
              >
                {ctaEnabled && <Check className="w-3 h-3" />}
                Add CTA Button
              </button>
              {ctaEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="CTA Label" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="bg-secondary/50 text-sm" />
                  <Input placeholder="CTA Link" value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="bg-secondary/50 text-sm" />
                </div>
              )}
            </div>

            <Button onClick={handleSave} className="w-full btn-primary-glow">
              {editingId ? 'Update Notice' : 'Publish Notice'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
