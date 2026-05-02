import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────
export type TripStatus =
  | 'scheduled'
  | 'boarding'
  | 'in_transit'
  | 'delayed'
  | 'arrived';

export type StaffRole = 'driver' | 'supervisor' | 'admin';

export type StopStatus = 'completed' | 'current' | 'upcoming';

export interface StaffUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  badge: string; // employee/staff badge
  avatar?: string;
}

export interface TripStop {
  id: string;
  name: string;
  type: 'boarding' | 'counter' | 'break' | 'destination';
  scheduledTime: string;
  actualTime?: string;
  status: StopStatus;
}

export interface DelayLog {
  id: string;
  reason: string;
  note?: string;
  estimatedMinutes: number;
  reportedAt: string;
  reportedBy: string;
}

export interface Trip {
  id: string;
  routeName: string;            // "Feni → Dhaka"
  from: string;
  to: string;
  busName: string;
  busReg: string;
  coachType: 'AC' | 'Non-AC';
  departureTime: string;        // "07:30"
  expectedArrival: string;      // "11:30"
  actualDeparture?: string;
  actualArrival?: string;
  status: TripStatus;
  driverId: string;
  supervisorId: string;
  staffId?: string;
  passengerCount: number;
  bookedSeats: number;
  totalSeats: number;
  fare: number;
  liveTracking: boolean;
  gpsSignal: 'strong' | 'weak' | 'lost';
  network: 'online' | 'weak' | 'offline';
  currentStopId?: string;
  stops: TripStop[];
  delays: DelayLog[];
  progressPercent: number;
  date: string;                 // ISO date
}

// ─── Mock staff ──────────────────────────────────────────
export const staffUsers: StaffUser[] = [
  { id: 'u-drv-01', name: 'Karim Uddin',  phone: '01712000001', email: 'karim@starline.bd',  role: 'driver',     badge: 'DRV-1042' },
  { id: 'u-drv-02', name: 'Rafiq Hossain',phone: '01712000002', email: 'rafiq@starline.bd',  role: 'driver',     badge: 'DRV-1058' },
  { id: 'u-sup-01', name: 'Md. Nasir',    phone: '01712000010', email: 'nasir@starline.bd',  role: 'supervisor', badge: 'SUP-220'  },
  { id: 'u-sup-02', name: 'Tariq Uddin',  phone: '01712000011', email: 'tariq@starline.bd',  role: 'supervisor', badge: 'SUP-241'  },
  { id: 'u-adm-01', name: 'Control Room', phone: '01712000020', email: 'ops@starline.bd',    role: 'admin',      badge: 'OPS-001'  },
];

// ─── Helpers ─────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);

const buildStops = (
  list: { name: string; type: TripStop['type']; time: string }[],
  currentIdx: number,
): TripStop[] =>
  list.map((s, i) => ({
    id: `stop-${i}`,
    name: s.name,
    type: s.type,
    scheduledTime: s.time,
    actualTime: i < currentIdx ? s.time : undefined,
    status:
      i < currentIdx ? 'completed' : i === currentIdx ? 'current' : 'upcoming',
  }));

// ─── Mock trips ──────────────────────────────────────────
const mockTrips: Trip[] = [
  {
    id: 'TRP-2026-1001',
    routeName: 'Feni → Dhaka',
    from: 'Feni',
    to: 'Dhaka',
    busName: 'Starline Platinum-01',
    busReg: 'Dhaka Metro-Ga-12-3456',
    coachType: 'AC',
    departureTime: '07:30',
    expectedArrival: '11:30',
    actualDeparture: '07:34',
    status: 'in_transit',
    driverId: 'u-drv-01',
    supervisorId: 'u-sup-01',
    passengerCount: 32,
    bookedSeats: 32,
    totalSeats: 36,
    fare: 850,
    liveTracking: true,
    gpsSignal: 'strong',
    network: 'online',
    currentStopId: 'stop-2',
    stops: buildStops(
      [
        { name: 'Mohipal Main Counter', type: 'boarding',    time: '07:30' },
        { name: 'Feni Terminal',        type: 'boarding',    time: '07:45' },
        { name: 'Comilla Bishwa Road',  type: 'counter',     time: '08:45' },
        { name: 'Daudkandi Highway',    type: 'break',       time: '09:30' },
        { name: 'Sayedabad Counter',    type: 'destination', time: '11:30' },
      ],
      2,
    ),
    delays: [],
    progressPercent: 48,
    date: today,
  },
  {
    id: 'TRP-2026-1002',
    routeName: 'Dhaka → Cox\'s Bazar',
    from: 'Dhaka',
    to: "Cox's Bazar",
    busName: 'Starline Gold-03',
    busReg: 'Dhaka Metro-Ga-14-7890',
    coachType: 'AC',
    departureTime: '22:00',
    expectedArrival: '06:00',
    status: 'boarding',
    driverId: 'u-drv-02',
    supervisorId: 'u-sup-01',
    passengerCount: 18,
    bookedSeats: 28,
    totalSeats: 36,
    fare: 1400,
    liveTracking: false,
    gpsSignal: 'strong',
    network: 'online',
    currentStopId: 'stop-0',
    stops: buildStops(
      [
        { name: 'Arambagh Counter',     type: 'boarding',    time: '22:00' },
        { name: 'Sayedabad Counter',    type: 'boarding',    time: '22:20' },
        { name: 'Comilla Bishwa Road',  type: 'counter',     time: '00:30' },
        { name: 'Chittagong Bypass',    type: 'break',       time: '03:00' },
        { name: 'Cox\'s Bazar Terminal',type: 'destination', time: '06:00' },
      ],
      0,
    ),
    delays: [],
    progressPercent: 0,
    date: today,
  },
  {
    id: 'TRP-2026-1003',
    routeName: 'Dhaka → Sylhet',
    from: 'Dhaka',
    to: 'Sylhet',
    busName: 'Starline Silver-05',
    busReg: 'Dhaka Metro-Ga-15-2345',
    coachType: 'AC',
    departureTime: '08:00',
    expectedArrival: '13:00',
    actualDeparture: '08:05',
    status: 'delayed',
    driverId: 'u-drv-01',
    supervisorId: 'u-sup-02',
    passengerCount: 36,
    bookedSeats: 36,
    totalSeats: 40,
    fare: 1000,
    liveTracking: true,
    gpsSignal: 'weak',
    network: 'weak',
    currentStopId: 'stop-2',
    stops: buildStops(
      [
        { name: 'Sayedabad Counter',  type: 'boarding',    time: '08:00' },
        { name: 'Bhairab Counter',    type: 'counter',     time: '09:30' },
        { name: 'Brahmanbaria Stop',  type: 'break',       time: '10:30' },
        { name: 'Habiganj Counter',   type: 'counter',     time: '12:00' },
        { name: 'Sylhet Terminal',    type: 'destination', time: '13:00' },
      ],
      2,
    ),
    delays: [
      {
        id: 'd1',
        reason: 'Traffic Congestion',
        note: 'Heavy jam near Bhairab',
        estimatedMinutes: 35,
        reportedAt: new Date().toISOString(),
        reportedBy: 'u-sup-02',
      },
    ],
    progressPercent: 42,
    date: today,
  },
  {
    id: 'TRP-2026-1004',
    routeName: 'Chattogram → Cox\'s Bazar',
    from: 'Chattogram',
    to: "Cox's Bazar",
    busName: 'Starline Platinum-04',
    busReg: 'Dhaka Metro-Ga-17-1234',
    coachType: 'AC',
    departureTime: '14:00',
    expectedArrival: '17:30',
    status: 'scheduled',
    driverId: 'u-drv-02',
    supervisorId: 'u-sup-02',
    passengerCount: 0,
    bookedSeats: 24,
    totalSeats: 41,
    fare: 700,
    liveTracking: false,
    gpsSignal: 'strong',
    network: 'online',
    currentStopId: 'stop-0',
    stops: buildStops(
      [
        { name: 'Chattogram Terminal',  type: 'boarding',    time: '14:00' },
        { name: 'Patiya Counter',       type: 'counter',     time: '14:45' },
        { name: 'Chakaria Break Point', type: 'break',       time: '16:00' },
        { name: 'Cox\'s Bazar Terminal',type: 'destination', time: '17:30' },
      ],
      0,
    ),
    delays: [],
    progressPercent: 0,
    date: today,
  },
  {
    id: 'TRP-2026-1005',
    routeName: 'Feni → Dhaka',
    from: 'Feni',
    to: 'Dhaka',
    busName: 'Starline Gold-06',
    busReg: 'Dhaka Metro-Ga-20-3456',
    coachType: 'AC',
    departureTime: '05:30',
    expectedArrival: '09:30',
    actualDeparture: '05:31',
    actualArrival: '09:25',
    status: 'arrived',
    driverId: 'u-drv-01',
    supervisorId: 'u-sup-01',
    passengerCount: 34,
    bookedSeats: 34,
    totalSeats: 36,
    fare: 850,
    liveTracking: false,
    gpsSignal: 'strong',
    network: 'online',
    stops: buildStops(
      [
        { name: 'Mohipal Main Counter', type: 'boarding',    time: '05:30' },
        { name: 'Feni Terminal',        type: 'boarding',    time: '05:45' },
        { name: 'Comilla Bishwa Road',  type: 'counter',     time: '06:45' },
        { name: 'Daudkandi Highway',    type: 'break',       time: '07:30' },
        { name: 'Sayedabad Counter',    type: 'destination', time: '09:30' },
      ],
      5,
    ).map(s => ({ ...s, status: 'completed' as StopStatus, actualTime: s.scheduledTime })),
    delays: [],
    progressPercent: 100,
    date: today,
  },
];

// ─── Delay reasons ───────────────────────────────────────
export const delayReasons = [
  'Traffic Congestion',
  'Weather Disruption',
  'Mechanical Issue',
  'Road Accident Ahead',
  'Police Checkpoint',
  'Passenger Boarding Delay',
  'Driver Rest Break',
  'Counter Hold',
  'Other',
];

// ─── Status meta ─────────────────────────────────────────
export const tripStatusMeta: Record<
  TripStatus,
  { label: string; tone: string; dot: string }
> = {
  scheduled:  { label: 'Scheduled',  tone: 'bg-info/15 text-info border-info/30',                   dot: 'bg-info' },
  boarding:   { label: 'Boarding',   tone: 'bg-accent/15 text-accent border-accent/30',             dot: 'bg-accent' },
  in_transit: { label: 'In Transit', tone: 'bg-success/15 text-success border-success/30',          dot: 'bg-success' },
  delayed:    { label: 'Delayed',    tone: 'bg-destructive/15 text-destructive border-destructive/30', dot: 'bg-destructive' },
  arrived:    { label: 'Arrived',    tone: 'bg-muted text-muted-foreground border-border',          dot: 'bg-muted-foreground' },
};

// ─── Store ───────────────────────────────────────────────
interface TripOpsState {
  currentUser: StaffUser | null;
  trips: Trip[];
  login: (identifier: string, password: string) => StaffUser | null;
  logout: () => void;
  setStatus: (tripId: string, status: TripStatus) => void;
  advanceStop: (tripId: string) => void;
  reportDelay: (tripId: string, delay: Omit<DelayLog, 'id' | 'reportedAt' | 'reportedBy'>) => void;
  markArrived: (tripId: string) => void;
  getTrip: (tripId: string) => Trip | undefined;
  tripsForUser: (userId: string) => Trip[];
}

const nowTime = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export const useTripOpsStore = create<TripOpsState>((set, get) => ({
  currentUser: null,
  trips: mockTrips,

  login: (identifier, password) => {
    if (!identifier || password.length < 3) return null;
    const id = identifier.toLowerCase().trim();
    const user =
      staffUsers.find(u => u.email.toLowerCase() === id || u.phone === id || u.badge.toLowerCase() === id) ??
      staffUsers[0]; // demo fallback
    set({ currentUser: user });
    return user;
  },

  logout: () => set({ currentUser: null }),

  setStatus: (tripId, status) =>
    set(state => ({
      trips: state.trips.map(t =>
        t.id === tripId
          ? {
              ...t,
              status,
              liveTracking: status === 'in_transit' || status === 'delayed' ? true : t.liveTracking,
              actualDeparture:
                status === 'in_transit' && !t.actualDeparture ? nowTime() : t.actualDeparture,
            }
          : t,
      ),
    })),

  advanceStop: (tripId) =>
    set(state => ({
      trips: state.trips.map(t => {
        if (t.id !== tripId) return t;
        const idx = t.stops.findIndex(s => s.status === 'current');
        if (idx === -1 || idx >= t.stops.length - 1) return t;
        const stops = t.stops.map((s, i) => {
          if (i === idx) return { ...s, status: 'completed' as StopStatus, actualTime: nowTime() };
          if (i === idx + 1) return { ...s, status: 'current' as StopStatus };
          return s;
        });
        const completed = stops.filter(s => s.status === 'completed').length;
        return {
          ...t,
          stops,
          currentStopId: stops[idx + 1]?.id,
          progressPercent: Math.round((completed / (stops.length - 1)) * 100),
        };
      }),
    })),

  reportDelay: (tripId, delay) =>
    set(state => ({
      trips: state.trips.map(t =>
        t.id === tripId
          ? {
              ...t,
              status: 'delayed',
              delays: [
                ...t.delays,
                {
                  ...delay,
                  id: `d-${Date.now()}`,
                  reportedAt: new Date().toISOString(),
                  reportedBy: state.currentUser?.id ?? 'system',
                },
              ],
            }
          : t,
      ),
    })),

  markArrived: (tripId) =>
    set(state => ({
      trips: state.trips.map(t =>
        t.id === tripId
          ? {
              ...t,
              status: 'arrived',
              actualArrival: nowTime(),
              liveTracking: false,
              progressPercent: 100,
              stops: t.stops.map(s => ({
                ...s,
                status: 'completed' as StopStatus,
                actualTime: s.actualTime ?? s.scheduledTime,
              })),
            }
          : t,
      ),
    })),

  getTrip: (tripId) => get().trips.find(t => t.id === tripId),
  tripsForUser: (userId) =>
    get().trips.filter(
      t => t.driverId === userId || t.supervisorId === userId || t.staffId === userId,
    ),
}));
