import { create } from 'zustand';

// ============= Types =============
export type ComplaintCategory =
  | 'Bus delay'
  | 'Payment issue'
  | 'Booking issue'
  | 'Staff behavior'
  | 'Counter service'
  | 'Wrong seat / bus issue'
  | 'Refund / cancellation'
  | 'Lost item'
  | 'Technical/app issue'
  | 'Other';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ComplaintTimeline {
  id: string;
  status: ComplaintStatus;
  note: string;
  by: string;
  at: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  customerName: string;
  phone: string;
  email: string;
  route: string;
  travelDate: string;
  boardingCounter: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  details: string;
  urgency: string;
  status: ComplaintStatus;
  assignedStaff: string;
  createdAt: string;
  updatedAt: string;
  timeline: ComplaintTimeline[];
  aiSummary: string;
  internalNotes: string;
}

export const complaintCategories: ComplaintCategory[] = [
  'Bus delay', 'Payment issue', 'Booking issue', 'Staff behavior',
  'Counter service', 'Wrong seat / bus issue', 'Refund / cancellation',
  'Lost item', 'Technical/app issue', 'Other',
];

export const complaintStatuses: ComplaintStatus[] = [
  'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed',
];

export const complaintPriorities: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const starlineRoutes = [
  'Dhaka → Feni', 'Feni → Dhaka', 'Dhaka → Chattogram', 'Chattogram → Dhaka',
  'Dhaka → Cox\'s Bazar', 'Cox\'s Bazar → Dhaka', 'Feni → Chattogram',
  'Chattogram → Feni', 'Feni → Cox\'s Bazar', 'Feni → Lakshmipur',
];

export const starlineCounters = [
  'Abdullahpur', 'Mohipal Main', 'Mohipal Flyover', 'Sayedabad', 'Maniknagar',
  'Kanchpur', 'Chauddagram', 'Cheora', 'Feni Terminal', 'Boropol (Chittagong)',
  'Sea Hill (Cox\'s Bazar)', 'Lakshmipur Terminal',
];

export const staffMembers = [
  'Tariq Uddin', 'Md. Nasir', 'Rezaul Karim', 'Sabbir Hasan', 'Arif Rahman',
];

// ============= Mock Complaints =============
export const mockComplaints: Complaint[] = [
  {
    id: '1', complaintId: 'STC-2048', customerName: 'Rahim Uddin', phone: '01712345678', email: 'rahim@email.com',
    route: 'Dhaka → Feni', travelDate: '2026-03-28', boardingCounter: 'Abdullahpur',
    category: 'Bus delay', priority: 'High', details: 'Bus was delayed by 2 hours from Abdullahpur terminal. No announcement was made. Very frustrating experience.',
    urgency: 'High', status: 'In Progress', assignedStaff: 'Tariq Uddin',
    createdAt: '2026-03-28T14:30:00', updatedAt: '2026-03-29T09:15:00',
    aiSummary: 'Customer experienced a 2-hour delay at Abdullahpur with no communication from staff. High priority due to repeated delay reports on this route.',
    internalNotes: 'Checked with dispatch — delay was due to engine issue at Kanchpur. Driver notified late.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Complaint submitted via AI chat', by: 'System', at: '2026-03-28T14:30:00' },
      { id: 't2', status: 'Under Review', note: 'Auto-assigned to operations team', by: 'System', at: '2026-03-28T14:35:00' },
      { id: 't3', status: 'Assigned', note: 'Assigned to Tariq Uddin for investigation', by: 'Md. Nasir', at: '2026-03-28T16:00:00' },
      { id: 't4', status: 'In Progress', note: 'Investigating root cause with dispatch', by: 'Tariq Uddin', at: '2026-03-29T09:15:00' },
    ],
  },
  {
    id: '2', complaintId: 'STC-2047', customerName: 'Fatema Begum', phone: '01898765432', email: 'fatema@email.com',
    route: 'Dhaka → Cox\'s Bazar', travelDate: '2026-03-27', boardingCounter: 'Sayedabad',
    category: 'Payment issue', priority: 'Critical', details: 'Payment of ৳2800 was deducted from bKash but ticket was not confirmed. Transaction ID: TXN-88721.',
    urgency: 'Critical', status: 'Assigned', assignedStaff: 'Rezaul Karim',
    createdAt: '2026-03-27T10:20:00', updatedAt: '2026-03-27T12:45:00',
    aiSummary: 'Payment deducted but booking not confirmed. Critical — requires immediate refund or ticket issuance.',
    internalNotes: 'bKash transaction verified. Awaiting system reconciliation.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Submitted via support page', by: 'System', at: '2026-03-27T10:20:00' },
      { id: 't2', status: 'Under Review', note: 'Flagged as critical — payment issue', by: 'System', at: '2026-03-27T10:25:00' },
      { id: 't3', status: 'Assigned', note: 'Assigned to finance team', by: 'Md. Nasir', at: '2026-03-27T12:45:00' },
    ],
  },
  {
    id: '3', complaintId: 'STC-2046', customerName: 'Kamal Ahmed', phone: '01611223344', email: 'kamal@email.com',
    route: 'Feni → Chattogram', travelDate: '2026-03-26', boardingCounter: 'Mohipal Main',
    category: 'Staff behavior', priority: 'Medium', details: 'Counter staff was rude and unhelpful when asked about seat change. Refused to assist despite available seats.',
    urgency: 'Medium', status: 'Resolved', assignedStaff: 'Sabbir Hasan',
    createdAt: '2026-03-26T16:40:00', updatedAt: '2026-03-28T11:00:00',
    aiSummary: 'Staff misconduct at Mohipal counter regarding seat change request. Resolved with staff counseling.',
    internalNotes: 'Staff counseled. Warning issued. Customer offered complimentary upgrade on next trip.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Complaint received', by: 'System', at: '2026-03-26T16:40:00' },
      { id: 't2', status: 'Assigned', note: 'Sent to HR for review', by: 'Md. Nasir', at: '2026-03-26T18:00:00' },
      { id: 't3', status: 'In Progress', note: 'Investigating with counter manager', by: 'Sabbir Hasan', at: '2026-03-27T09:00:00' },
      { id: 't4', status: 'Resolved', note: 'Staff warning issued. Customer compensated.', by: 'Sabbir Hasan', at: '2026-03-28T11:00:00' },
    ],
  },
  {
    id: '4', complaintId: 'STC-2045', customerName: 'Nasrin Akter', phone: '01555667788', email: 'nasrin@email.com',
    route: 'Dhaka → Chattogram', travelDate: '2026-03-25', boardingCounter: 'Maniknagar',
    category: 'Wrong seat / bus issue', priority: 'High', details: 'Was given seat B3 but it was already occupied. Had to sit in a different seat. Very embarrassing.',
    urgency: 'High', status: 'Under Review', assignedStaff: '',
    createdAt: '2026-03-25T22:10:00', updatedAt: '2026-03-26T08:00:00',
    aiSummary: 'Double booking of seat B3 on Dhaka-Chattogram route. Needs booking system investigation.',
    internalNotes: '',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Complaint submitted', by: 'System', at: '2026-03-25T22:10:00' },
      { id: 't2', status: 'Under Review', note: 'Queued for booking team review', by: 'System', at: '2026-03-26T08:00:00' },
    ],
  },
  {
    id: '5', complaintId: 'STC-2044', customerName: 'Shahidul Islam', phone: '01744556677', email: 'shahid@email.com',
    route: 'Cox\'s Bazar → Dhaka', travelDate: '2026-03-24', boardingCounter: 'Sea Hill (Cox\'s Bazar)',
    category: 'Lost item', priority: 'Medium', details: 'Left a black laptop bag under seat A4 on the 10PM departure. Contains Dell laptop and documents.',
    urgency: 'Medium', status: 'In Progress', assignedStaff: 'Arif Rahman',
    createdAt: '2026-03-25T06:00:00', updatedAt: '2026-03-26T14:00:00',
    aiSummary: 'Lost laptop bag on Cox\'s Bazar-Dhaka route. Item description logged. Checking with arrival terminal.',
    internalNotes: 'Dhaka terminal cleaning staff checking. Item may be in Maniknagar lost & found.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Lost item report filed', by: 'System', at: '2026-03-25T06:00:00' },
      { id: 't2', status: 'Assigned', note: 'Assigned to lost & found team', by: 'Md. Nasir', at: '2026-03-25T08:30:00' },
      { id: 't3', status: 'In Progress', note: 'Checking Maniknagar terminal', by: 'Arif Rahman', at: '2026-03-26T14:00:00' },
    ],
  },
  {
    id: '6', complaintId: 'STC-2043', customerName: 'Ayesha Siddika', phone: '01933445566', email: 'ayesha@email.com',
    route: 'Dhaka → Feni', travelDate: '2026-03-23', boardingCounter: 'Abdullahpur',
    category: 'Refund / cancellation', priority: 'Low', details: 'Cancelled booking STR-2026-48295 but refund not received after 5 days.',
    urgency: 'Low', status: 'Closed', assignedStaff: 'Rezaul Karim',
    createdAt: '2026-03-28T09:00:00', updatedAt: '2026-03-30T10:00:00',
    aiSummary: 'Refund delay for cancelled booking. Refund was processed on day 3 but bKash delay.',
    internalNotes: 'Refund confirmed by finance. Customer notified.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Refund inquiry', by: 'System', at: '2026-03-28T09:00:00' },
      { id: 't2', status: 'Assigned', note: 'Finance team checking', by: 'Md. Nasir', at: '2026-03-28T10:00:00' },
      { id: 't3', status: 'Resolved', note: 'Refund processed. 2-3 day bKash delay.', by: 'Rezaul Karim', at: '2026-03-29T15:00:00' },
      { id: 't4', status: 'Closed', note: 'Customer confirmed receipt.', by: 'Rezaul Karim', at: '2026-03-30T10:00:00' },
    ],
  },
  {
    id: '7', complaintId: 'STC-2042', customerName: 'Mizanur Rahman', phone: '01822334455', email: 'mizan@email.com',
    route: 'Chattogram → Dhaka', travelDate: '2026-03-29', boardingCounter: 'Boropol (Chittagong)',
    category: 'Counter service', priority: 'Medium', details: 'Counter was closed at 9PM despite website showing operating hours until 11PM.',
    urgency: 'Medium', status: 'Submitted', assignedStaff: '',
    createdAt: '2026-03-29T21:30:00', updatedAt: '2026-03-29T21:30:00',
    aiSummary: 'Counter operating hour mismatch between website and actual. Needs counter schedule verification.',
    internalNotes: '',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'New complaint received', by: 'System', at: '2026-03-29T21:30:00' },
    ],
  },
  {
    id: '8', complaintId: 'STC-2041', customerName: 'Taslima Khatun', phone: '01666778899', email: 'taslima@email.com',
    route: 'Feni → Cox\'s Bazar', travelDate: '2026-03-22', boardingCounter: 'Feni Terminal',
    category: 'Booking issue', priority: 'High', details: 'Booked 2 seats online but system only confirmed 1. Need urgent resolution before travel.',
    urgency: 'High', status: 'Resolved', assignedStaff: 'Tariq Uddin',
    createdAt: '2026-03-22T08:00:00', updatedAt: '2026-03-22T14:00:00',
    aiSummary: 'Partial booking confirmation — only 1 of 2 seats confirmed. System glitch suspected.',
    internalNotes: 'System timeout during payment. Second seat manually added.',
    timeline: [
      { id: 't1', status: 'Submitted', note: 'Urgent booking issue', by: 'System', at: '2026-03-22T08:00:00' },
      { id: 't2', status: 'Assigned', note: 'Urgent — assigned immediately', by: 'System', at: '2026-03-22T08:10:00' },
      { id: 't3', status: 'In Progress', note: 'Checking booking system logs', by: 'Tariq Uddin', at: '2026-03-22T09:00:00' },
      { id: 't4', status: 'Resolved', note: 'Second seat confirmed manually. Customer notified.', by: 'Tariq Uddin', at: '2026-03-22T14:00:00' },
    ],
  },
];

// ============= Support Store =============
interface SupportStore {
  complaints: Complaint[];
  addComplaint: (c: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  complaints: mockComplaints,
  addComplaint: (c) => set((s) => ({ complaints: [c, ...s.complaints] })),
  updateComplaint: (id, updates) =>
    set((s) => ({
      complaints: s.complaints.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}));

// ============= FAQ Data =============
export const supportFaqs = [
  {
    category: 'Booking & Tickets',
    icon: 'Ticket',
    items: [
      { q: 'How do I book a ticket?', a: 'Use the search form on our homepage to find trips. Select your preferred bus, choose seats, enter passenger details, and complete the payment via bKash, Nagad, or card.' },
      { q: 'Can I book for multiple passengers?', a: 'Yes, select the number of passengers in the search form. You can book up to 6 seats per transaction.' },
      { q: 'What if my payment is deducted but ticket not confirmed?', a: 'Contact our support immediately via chat or hotline 16XXX. Provide your transaction ID and we will resolve within 2 hours.' },
    ],
  },
  {
    category: 'Cancellation & Refunds',
    icon: 'RefreshCw',
    items: [
      { q: 'How do I cancel a booking?', a: 'Go to "Manage Booking", enter your booking ID and phone number, then click "Cancel Booking". Free cancellation up to 6 hours before departure.' },
      { q: 'How do I request a refund?', a: 'Refunds are automatic on cancellation. bKash/Nagad refunds take 1-2 business days. Card refunds take 5-7 business days.' },
      { q: 'Can I reschedule my trip?', a: 'Yes, you can reschedule up to 4 hours before departure for free, subject to seat availability on the new trip.' },
    ],
  },
  {
    category: 'Routes & Counters',
    icon: 'MapPin',
    items: [
      { q: 'How do I contact a counter?', a: 'Visit our Counters page for phone numbers and locations of all Star Line terminals and counters across Bangladesh.' },
      { q: 'What routes does Star Line operate?', a: 'We operate across major routes including Dhaka-Feni, Dhaka-Chattogram, Dhaka-Cox\'s Bazar, Feni-Lakshmipur, and more.' },
    ],
  },
  {
    category: 'On the Trip',
    icon: 'Bus',
    items: [
      { q: 'What should I do if the bus is delayed?', a: 'Check the Live Tracking page for real-time updates. If the delay exceeds 30 minutes, you can file a complaint for compensation consideration.' },
      { q: 'How do I report staff misconduct?', a: 'Use the AI Chat support or submit a complaint through the Support page. Select "Staff behavior" as the category. All reports are investigated within 24 hours.' },
      { q: 'What is the baggage allowance?', a: 'Each passenger is allowed 2 bags (max 20kg each) in the luggage compartment plus 1 carry-on bag.' },
    ],
  },
];

// ============= Support Categories =============
export const supportCategories = [
  { id: 'booking', label: 'Booking Support', icon: 'Ticket', desc: 'Help with booking, changes & issues' },
  { id: 'routes', label: 'Route & Counter Info', icon: 'MapPin', desc: 'Find routes, terminals & schedules' },
  { id: 'payment', label: 'Payment Help', icon: 'CreditCard', desc: 'Payment issues & transaction help' },
  { id: 'changes', label: 'Ticket Changes', icon: 'RefreshCw', desc: 'Reschedule or modify your trip' },
  { id: 'refund', label: 'Refund Help', icon: 'ArrowLeftRight', desc: 'Cancellation & refund status' },
  { id: 'lost', label: 'Lost & Found', icon: 'Search', desc: 'Report or claim lost items' },
  { id: 'complaint', label: 'Complaint Center', icon: 'AlertTriangle', desc: 'Submit & track complaints' },
  { id: 'human', label: 'Human Support', icon: 'Headphones', desc: 'Talk to a support agent' },
];
