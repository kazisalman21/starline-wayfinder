import { create } from 'zustand';

export type NoticeCategory =
  | 'Delay' | 'Weather' | 'Counter Update' | 'Service Notice'
  | 'Payment Notice' | 'Eid Special' | 'Route Advisory'
  | 'Policy Update' | 'Emergency Alert' | 'Promotion';

export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoticeDisplay = 'banner' | 'card' | 'contextual' | 'dashboard' | 'support';
export type NoticeStatus = 'draft' | 'published' | 'archived';

export interface Notice {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  status: NoticeStatus;
  displayTypes: NoticeDisplay[];
  activeFrom: string;
  activeUntil: string;
  affectedRoutes: string[];
  affectedCounters: string[];
  showOnHomepage: boolean;
  showInTopBar: boolean;
  showInBookingFlow: boolean;
  showInSupport: boolean;
  showInUserDashboard: boolean;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
}

export const noticeCategories: NoticeCategory[] = [
  'Delay', 'Weather', 'Counter Update', 'Service Notice',
  'Payment Notice', 'Eid Special', 'Route Advisory',
  'Policy Update', 'Emergency Alert', 'Promotion',
];

export const noticePriorities: NoticePriority[] = ['low', 'medium', 'high', 'urgent'];

export const mockNotices: Notice[] = [
  {
    id: 'NTC-001',
    title: 'Dhaka → Cox\'s Bazar departures may face delay today',
    summary: 'Due to heavy rainfall in the Chittagong division, departures toward Cox\'s Bazar may experience 20–40 minute delays.',
    content: 'Due to heavy rainfall and waterlogging in parts of the Chittagong division, our Dhaka → Cox\'s Bazar service may experience delays of 20–40 minutes today. Our operations team is actively monitoring road conditions. Passengers are requested to check live tracking for real-time updates. We apologize for any inconvenience and appreciate your patience.',
    category: 'Weather',
    priority: 'high',
    status: 'published',
    displayTypes: ['banner', 'card', 'contextual'],
    activeFrom: '2026-04-04T06:00:00',
    activeUntil: '2026-04-04T23:59:00',
    affectedRoutes: ['Dhaka → Cox\'s Bazar'],
    affectedCounters: ['Abdullahpur', 'Maniknagar'],
    showOnHomepage: true,
    showInTopBar: true,
    showInBookingFlow: true,
    showInSupport: true,
    showInUserDashboard: true,
    createdAt: '2026-04-04T05:30:00',
    updatedAt: '2026-04-04T05:30:00',
  },
  {
    id: 'NTC-002',
    title: 'Mohipal Main counter temporarily shifted',
    summary: 'Mohipal Main counter operations have been temporarily relocated to Mohipal Flyover point until further notice.',
    content: 'Due to ongoing road construction near Mohipal Main counter, our boarding and ticketing operations have been temporarily shifted to the Mohipal Flyover boarding point. All scheduled services remain unaffected. Passengers are requested to arrive at the Mohipal Flyover point for boarding. Signage and staff will be available for guidance.',
    category: 'Counter Update',
    priority: 'urgent',
    status: 'published',
    displayTypes: ['banner', 'card', 'contextual'],
    activeFrom: '2026-04-01T00:00:00',
    activeUntil: '2026-04-15T23:59:00',
    affectedRoutes: ['Dhaka → Feni', 'Feni → Dhaka'],
    affectedCounters: ['Mohipal Main'],
    showOnHomepage: true,
    showInTopBar: true,
    showInBookingFlow: true,
    showInSupport: true,
    showInUserDashboard: true,
    createdAt: '2026-03-31T10:00:00',
    updatedAt: '2026-04-01T08:00:00',
  },
  {
    id: 'NTC-003',
    title: 'Online payment maintenance scheduled tonight',
    summary: 'Online payment services (bKash, Nagad, Card) will be briefly unavailable tonight from 2:00 AM to 3:00 AM.',
    content: 'We will be performing scheduled maintenance on our online payment gateway tonight from 2:00 AM to 3:00 AM BST. During this window, bKash, Nagad, and card payments will be temporarily unavailable. Counter cash payments remain unaffected. We recommend completing any pending payments before the maintenance window.',
    category: 'Payment Notice',
    priority: 'medium',
    status: 'published',
    displayTypes: ['banner', 'card'],
    activeFrom: '2026-04-04T18:00:00',
    activeUntil: '2026-04-05T03:30:00',
    affectedRoutes: [],
    affectedCounters: [],
    showOnHomepage: true,
    showInTopBar: true,
    showInBookingFlow: true,
    showInSupport: false,
    showInUserDashboard: false,
    createdAt: '2026-04-04T12:00:00',
    updatedAt: '2026-04-04T12:00:00',
  },
  {
    id: 'NTC-004',
    title: 'Eid special buses now open for booking',
    summary: 'Book your Eid-ul-Fitr travel early! Special additional services added on all major routes with extra departures.',
    content: 'Star Line is pleased to announce special Eid-ul-Fitr services across all major routes. Additional departures have been added from April 8–12 to accommodate the holiday rush. Early booking is strongly recommended as seats fill up fast. Special Eid fares apply on select routes. Book now through our website or at any Star Line counter.',
    category: 'Eid Special',
    priority: 'low',
    status: 'published',
    displayTypes: ['card'],
    activeFrom: '2026-04-01T00:00:00',
    activeUntil: '2026-04-12T23:59:00',
    affectedRoutes: ['Dhaka → Feni', 'Dhaka → Chattogram', 'Dhaka → Cox\'s Bazar'],
    affectedCounters: [],
    showOnHomepage: true,
    showInTopBar: false,
    showInBookingFlow: false,
    showInSupport: true,
    showInUserDashboard: false,
    ctaText: 'Book Eid Trips',
    ctaLink: '/search',
    createdAt: '2026-03-28T09:00:00',
    updatedAt: '2026-04-01T09:00:00',
  },
  {
    id: 'NTC-005',
    title: 'Passengers are requested to arrive 20 minutes before departure',
    summary: 'To ensure smooth boarding, all passengers should arrive at their boarding counter at least 20 minutes before scheduled departure.',
    content: 'For a seamless travel experience, Star Line requests all passengers to arrive at their designated boarding point at least 20 minutes prior to the scheduled departure time. Late arrivals may not be accommodated if the coach departs on schedule. Please carry your ticket (printed or digital) and a valid photo ID.',
    category: 'Service Notice',
    priority: 'low',
    status: 'published',
    displayTypes: ['card', 'contextual'],
    activeFrom: '2026-01-01T00:00:00',
    activeUntil: '2026-12-31T23:59:00',
    affectedRoutes: [],
    affectedCounters: [],
    showOnHomepage: false,
    showInTopBar: false,
    showInBookingFlow: true,
    showInSupport: true,
    showInUserDashboard: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'NTC-006',
    title: 'Feni → Chittagong route advisory: minor detour via Mirsharai',
    summary: 'Due to bridge repair work, Feni → Chittagong coaches will take a brief detour via Mirsharai bypass. Expect 15 min extra travel time.',
    content: 'A bridge repair project on the Feni–Chittagong highway near Sitakunda has necessitated a temporary detour via the Mirsharai bypass road. This may add approximately 15 minutes to the usual journey time. The detour is expected to remain in effect until April 20. We appreciate your understanding.',
    category: 'Route Advisory',
    priority: 'medium',
    status: 'published',
    displayTypes: ['card', 'contextual'],
    activeFrom: '2026-04-02T00:00:00',
    activeUntil: '2026-04-20T23:59:00',
    affectedRoutes: ['Feni → Chittagong'],
    affectedCounters: [],
    showOnHomepage: true,
    showInTopBar: false,
    showInBookingFlow: true,
    showInSupport: false,
    showInUserDashboard: true,
    createdAt: '2026-04-02T07:00:00',
    updatedAt: '2026-04-02T07:00:00',
  },
  {
    id: 'NTC-007',
    title: 'Refund policy updated for Eid travel period',
    summary: 'During the Eid rush period (Apr 8–12), cancellations made less than 6 hours before departure are non-refundable.',
    content: 'Please note that during the Eid-ul-Fitr peak travel period (April 8–12, 2026), our cancellation and refund policy has been temporarily updated. Cancellations made less than 6 hours before scheduled departure will not be eligible for a refund. Cancellations made 6–24 hours before departure will receive a 50% refund. Full refunds are available for cancellations made more than 24 hours in advance.',
    category: 'Policy Update',
    priority: 'high',
    status: 'published',
    displayTypes: ['card'],
    activeFrom: '2026-04-05T00:00:00',
    activeUntil: '2026-04-13T23:59:00',
    affectedRoutes: [],
    affectedCounters: [],
    showOnHomepage: true,
    showInTopBar: false,
    showInBookingFlow: true,
    showInSupport: true,
    showInUserDashboard: false,
    createdAt: '2026-04-03T14:00:00',
    updatedAt: '2026-04-03T14:00:00',
  },
  {
    id: 'NTC-008',
    title: 'Flash sale: 15% off on Dhaka–Chattogram this weekend',
    summary: 'Enjoy 15% discount on all Dhaka ↔ Chattogram trips this Saturday and Sunday. Use code STARWEEKEND.',
    content: 'Star Line is offering a special 15% discount on all Dhaka ↔ Chattogram services this weekend (April 5–6). Use promo code STARWEEKEND at checkout. Valid for online bookings only. Limited seats available at promotional fares. Terms and conditions apply.',
    category: 'Promotion',
    priority: 'low',
    status: 'published',
    displayTypes: ['card'],
    activeFrom: '2026-04-04T00:00:00',
    activeUntil: '2026-04-06T23:59:00',
    affectedRoutes: ['Dhaka → Chattogram', 'Chattogram → Dhaka'],
    affectedCounters: [],
    showOnHomepage: true,
    showInTopBar: true,
    showInBookingFlow: false,
    showInSupport: false,
    showInUserDashboard: false,
    ctaText: 'Book Now',
    ctaLink: '/search?from=Dhaka&to=Chattogram',
    createdAt: '2026-04-03T10:00:00',
    updatedAt: '2026-04-03T10:00:00',
  },
];

// Zustand store
interface NoticeStore {
  notices: Notice[];
  dismissedBannerIds: string[];
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  dismissBanner: (id: string) => void;
}

export const useNoticeStore = create<NoticeStore>((set) => ({
  notices: mockNotices,
  dismissedBannerIds: [],
  addNotice: (notice) => set((s) => ({ notices: [notice, ...s.notices] })),
  updateNotice: (id, updates) =>
    set((s) => ({
      notices: s.notices.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  deleteNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
  dismissBanner: (id) => set((s) => ({ dismissedBannerIds: [...s.dismissedBannerIds, id] })),
}));

// helpers
export const priorityConfig: Record<NoticePriority, { color: string; label: string; bg: string }> = {
  urgent: { color: 'text-red-400', label: 'Urgent', bg: 'bg-red-500/15 border-red-500/30' },
  high: { color: 'text-orange-400', label: 'High', bg: 'bg-orange-500/15 border-orange-500/30' },
  medium: { color: 'text-blue-400', label: 'Medium', bg: 'bg-blue-500/15 border-blue-500/30' },
  low: { color: 'text-muted-foreground', label: 'Low', bg: 'bg-secondary border-border' },
};

export const categoryConfig: Record<NoticeCategory, { icon: string; color: string }> = {
  'Delay': { icon: '⏱', color: 'text-orange-400' },
  'Weather': { icon: '🌧', color: 'text-blue-400' },
  'Counter Update': { icon: '📍', color: 'text-yellow-400' },
  'Service Notice': { icon: '📋', color: 'text-muted-foreground' },
  'Payment Notice': { icon: '💳', color: 'text-purple-400' },
  'Eid Special': { icon: '🌙', color: 'text-emerald-400' },
  'Route Advisory': { icon: '🛣', color: 'text-amber-400' },
  'Policy Update': { icon: '📜', color: 'text-sky-400' },
  'Emergency Alert': { icon: '🚨', color: 'text-red-400' },
  'Promotion': { icon: '🎉', color: 'text-accent' },
};

export function getActiveNotices(notices: Notice[]): Notice[] {
  const now = new Date().toISOString();
  return notices.filter(
    (n) => n.status === 'published' && n.activeFrom <= now && n.activeUntil >= now
  );
}

export function getTopBarNotices(notices: Notice[]): Notice[] {
  return getActiveNotices(notices).filter((n) => n.showInTopBar);
}

export function getHomepageNotices(notices: Notice[]): Notice[] {
  return getActiveNotices(notices).filter((n) => n.showOnHomepage);
}

export function getBookingFlowNotices(notices: Notice[], route?: string): Notice[] {
  return getActiveNotices(notices)
    .filter((n) => n.showInBookingFlow)
    .filter((n) => !route || n.affectedRoutes.length === 0 || n.affectedRoutes.includes(route));
}
