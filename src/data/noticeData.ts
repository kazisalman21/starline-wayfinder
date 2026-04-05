import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────
export type NoticeType =
  | 'emergency' | 'promotion' | 'fare_update' | 'route_notice'
  | 'maintenance' | 'app_update' | 'general';

export type NoticePriority = 'critical' | 'high' | 'normal';

export type NoticeStatus = 'active' | 'scheduled' | 'expired' | 'inactive';

export interface NoticeCta {
  label: string;
  href: string;
}

export interface Notice {
  id: string;
  title: string;
  summary: string;
  body: string;
  type: NoticeType;
  priority: NoticePriority;
  isPinned: boolean;
  isActive: boolean;
  showOnHomepage: boolean;
  showInBar: boolean;
  popupOnCritical: boolean;
  publishedAt: string;
  expiresAt: string | null;
  route?: string;
  counter?: string;
  cta?: NoticeCta;
  updatedAt?: string;
}

// ─── Config maps ─────────────────────────────────────────
export const noticeTypes: NoticeType[] = [
  'emergency', 'promotion', 'fare_update', 'route_notice',
  'maintenance', 'app_update', 'general',
];

export const noticeTypeConfig: Record<NoticeType, { label: string; color: string; bg: string; border: string }> = {
  emergency:    { label: 'Emergency',    color: 'text-red-500',     bg: 'bg-red-500/10',     border: 'border-red-500/30' },
  promotion:    { label: 'Promotion',    color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  fare_update:  { label: 'Fare Update',  color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  route_notice: { label: 'Route Notice', color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30' },
  maintenance:  { label: 'Maintenance',  color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/30' },
  app_update:   { label: 'App Update',   color: 'text-violet-500',  bg: 'bg-violet-500/10',  border: 'border-violet-500/30' },
  general:      { label: 'General',      color: 'text-zinc-400',    bg: 'bg-zinc-500/10',    border: 'border-zinc-500/30' },
};

export const noticePriorityConfig: Record<NoticePriority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: 'text-red-400',            bg: 'bg-red-500/15' },
  high:     { label: 'High',     color: 'text-orange-400',         bg: 'bg-orange-500/15' },
  normal:   { label: 'Normal',   color: 'text-muted-foreground',   bg: 'bg-secondary' },
};

// ─── Mock data ───────────────────────────────────────────
export const mockNotices: Notice[] = [
  {
    id: 'NTC-001',
    title: 'Dhaka–Feni route suspended April 6–7 due to road damage',
    summary: 'All Dhaka–Feni services are temporarily suspended due to major road repair near Comilla bypass. Services resume April 8.',
    body: 'Due to significant road damage on the Dhaka–Feni highway near the Comilla bypass area, all Star Line services on this route have been suspended effective April 6–7, 2026.\n\nOur operations team is coordinating with highway authorities. Services are expected to resume on April 8 pending road clearance.\n\nPassengers with confirmed bookings will receive a full refund or free rebooking to the next available date. Please contact Star Line Care for assistance.',
    type: 'emergency',
    priority: 'critical',
    isPinned: true,
    isActive: true,
    showOnHomepage: true,
    showInBar: true,
    popupOnCritical: true,
    publishedAt: '2026-04-05T06:00:00',
    expiresAt: '2026-04-08T06:00:00',
    route: 'Dhaka → Feni',
    updatedAt: '2026-04-05T06:00:00',
  },
  {
    id: 'NTC-002',
    title: 'Eid Special — 20% off all routes, book before April 15',
    summary: 'Celebrate Eid-ul-Fitr with Star Line! Enjoy 20% off on all routes when you book before April 15. Limited seats.',
    body: 'Star Line Group is offering a special Eid-ul-Fitr promotion — 20% off on all routes across AC and Non-AC services.\n\nOffer valid for bookings made before April 15, 2026. Travel dates: April 8–20.\n\nThis promotion applies to online bookings only. Use code EID20 at checkout.\n\nSeats are limited and will be allocated on a first-come, first-served basis. Early booking is highly recommended during the holiday period.',
    type: 'promotion',
    priority: 'high',
    isPinned: false,
    isActive: true,
    showOnHomepage: true,
    showInBar: true,
    popupOnCritical: false,
    publishedAt: '2026-04-03T09:00:00',
    expiresAt: '2026-04-15T23:59:00',
    cta: { label: 'Book Now', href: '/search' },
    updatedAt: '2026-04-03T09:00:00',
  },
  {
    id: 'NTC-003',
    title: 'Revised fares effective April 12 across all AC services',
    summary: 'Updated fare structure for all AC routes takes effect April 12. Non-AC fares remain unchanged.',
    body: 'Effective April 12, 2026, Star Line Group will implement a revised fare structure for all AC services across our network.\n\nThis adjustment reflects increased fuel costs and operational improvements including new fleet additions and enhanced onboard amenities.\n\nNon-AC service fares remain unchanged.\n\nUpdated fare details will be reflected in our booking system from April 10. Bookings made before April 10 at current fares will be honored.',
    type: 'fare_update',
    priority: 'high',
    isPinned: false,
    isActive: true,
    showOnHomepage: true,
    showInBar: false,
    popupOnCritical: false,
    publishedAt: '2026-04-04T14:00:00',
    expiresAt: '2026-04-20T23:59:00',
    updatedAt: '2026-04-04T14:00:00',
  },
  {
    id: 'NTC-004',
    title: 'System maintenance tonight 1:00 AM–3:00 AM — booking may be unavailable',
    summary: 'Scheduled maintenance on our booking platform tonight. Online ticket purchases and payment processing will be temporarily paused.',
    body: 'We will be performing scheduled maintenance on our online booking and payment systems tonight from 1:00 AM to 3:00 AM BST.\n\nDuring this window:\n• Online ticket booking will be unavailable\n• bKash, Nagad, and card payments will be paused\n• Live tracking will remain operational\n• Counter bookings and cash payments are unaffected\n\nWe recommend completing any pending online bookings before the maintenance window.',
    type: 'maintenance',
    priority: 'normal',
    isPinned: false,
    isActive: true,
    showOnHomepage: true,
    showInBar: true,
    popupOnCritical: false,
    publishedAt: '2026-04-05T18:00:00',
    expiresAt: '2026-04-06T03:30:00',
    updatedAt: '2026-04-05T18:00:00',
  },
  {
    id: 'NTC-005',
    title: 'Star Line app v2.1 live — ticket history, dark mode, faster booking',
    summary: 'The latest Star Line app update brings ticket history, dark mode support, and a faster booking experience.',
    body: 'Star Line app version 2.1 is now available on Google Play and Apple App Store.\n\nNew features:\n• Complete ticket history — view and download past tickets\n• Dark mode — easier on the eyes during night travel\n• Faster booking flow — 40% quicker checkout process\n• Improved live tracking with ETA accuracy\n• Bug fixes and performance improvements\n\nUpdate your app today for the best Star Line experience.',
    type: 'app_update',
    priority: 'normal',
    isPinned: false,
    isActive: true,
    showOnHomepage: false,
    showInBar: false,
    popupOnCritical: false,
    publishedAt: '2026-04-02T10:00:00',
    expiresAt: null,
    updatedAt: '2026-04-02T10:00:00',
  },
];

// ─── Zustand store ───────────────────────────────────────
interface NoticeStore {
  notices: Notice[];
  dismissedBarIds: string[];
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  dismissBar: (id: string) => void;
}

export const useNoticeStore = create<NoticeStore>((set) => ({
  notices: mockNotices,
  dismissedBarIds: [],
  addNotice: (notice) => set((s) => ({ notices: [notice, ...s.notices] })),
  updateNotice: (id, updates) =>
    set((s) => ({ notices: s.notices.map((n) => (n.id === id ? { ...n, ...updates } : n)) })),
  deleteNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
  dismissBar: (id) => set((s) => ({ dismissedBarIds: [...s.dismissedBarIds, id] })),
}));

// ─── Helpers ─────────────────────────────────────────────
export function getNoticeStatus(n: Notice): NoticeStatus {
  if (!n.isActive) return 'inactive';
  const now = new Date();
  const pub = new Date(n.publishedAt);
  if (pub > now) return 'scheduled';
  if (n.expiresAt && new Date(n.expiresAt) < now) return 'expired';
  return 'active';
}

export function getActiveNotices(notices: Notice[]): Notice[] {
  return notices.filter((n) => getNoticeStatus(n) === 'active');
}

export function getBarNotices(notices: Notice[]): Notice[] {
  return getActiveNotices(notices).filter((n) => n.showInBar);
}

export function getHomepageNotices(notices: Notice[]): Notice[] {
  return getActiveNotices(notices)
    .filter((n) => n.showOnHomepage)
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));
}

export function getBookingFlowNotices(notices: Notice[], route?: string): Notice[] {
  return getActiveNotices(notices).filter((n) => {
    if (!route) return true;
    return !n.route || n.route === route;
  });
}

export function sortByPriority(notices: Notice[]): Notice[] {
  const order: Record<NoticePriority, number> = { critical: 0, high: 1, normal: 2 };
  return [...notices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return order[a.priority] - order[b.priority];
  });
}
