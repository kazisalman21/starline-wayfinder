export interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  basePrice: number;
  acPrice: number;
  popularity: number;
}

export interface BusResult {
  id: string;
  routeId: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  coachType: 'AC' | 'Non-AC';
  coachName: string;
  amenities: string[];
  availableSeats: number;
  totalSeats: number;
  fare: number;
  boardingPoints: string[];
  droppingPoints: string[];
  date: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  busId: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  phone: string;
  email: string;
  seats: string[];
  totalFare: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  coachType: string;
  coachName: string;
  boardingPoint: string;
  droppingPoint: string;
  paymentMethod: string;
}

export const cities = [
  'Dhaka', 'Chattogram', "Cox's Bazar", 'Feni', 'Parshuram', 'Chhagalnaiya',
  'Lakshmipur', 'Sylhet', 'Comilla', 'Rajshahi', 'Khulna', 'Rangpur',
  'Mymensingh', 'Bogura', 'Gazipur',
];

export const popularRoutes: Route[] = [
  { id: 'r1', from: 'Feni', to: 'Dhaka', distance: '157 km', duration: '4h 00m', basePrice: 550, acPrice: 850, popularity: 98 },
  { id: 'r2', from: 'Dhaka', to: 'Feni', distance: '157 km', duration: '4h 00m', basePrice: 550, acPrice: 850, popularity: 96 },
  { id: 'r3', from: 'Feni', to: 'Chattogram', distance: '120 km', duration: '3h 00m', basePrice: 400, acPrice: 650, popularity: 90 },
  { id: 'r4', from: 'Feni', to: "Cox's Bazar", distance: '230 km', duration: '5h 30m', basePrice: 650, acPrice: 1000, popularity: 88 },
  { id: 'r5', from: 'Dhaka', to: 'Chattogram', distance: '264 km', duration: '5h 30m', basePrice: 700, acPrice: 1100, popularity: 95 },
  { id: 'r6', from: 'Chattogram', to: "Cox's Bazar", distance: '152 km', duration: '3h 30m', basePrice: 450, acPrice: 700, popularity: 85 },
  { id: 'r7', from: 'Parshuram', to: 'Dhaka', distance: '175 km', duration: '4h 30m', basePrice: 600, acPrice: 900, popularity: 78 },
  { id: 'r8', from: 'Feni', to: 'Lakshmipur', distance: '80 km', duration: '2h 30m', basePrice: 300, acPrice: 500, popularity: 72 },
  { id: 'r9', from: 'Chhagalnaiya', to: 'Dhaka', distance: '165 km', duration: '4h 15m', basePrice: 580, acPrice: 880, popularity: 70 },
  { id: 'r10', from: 'Dhaka', to: "Cox's Bazar", distance: '392 km', duration: '8h 00m', basePrice: 900, acPrice: 1400, popularity: 92 },
  { id: 'r11', from: 'Dhaka', to: 'Sylhet', distance: '240 km', duration: '5h 00m', basePrice: 650, acPrice: 1000, popularity: 80 },
  { id: 'r12', from: 'Dhaka', to: 'Comilla', distance: '97 km', duration: '2h 30m', basePrice: 350, acPrice: 550, popularity: 75 },
];

// Route-aware boarding/dropping points
const routeBoardingDropping: Record<string, { boarding: string[]; dropping: string[] }> = {
  'Feni→Dhaka': {
    boarding: ['Mohipal Main Counter', 'Mohipal Flyover Counter', 'Feni Terminal'],
    dropping: ['Sayedabad Counter', 'Maniknagar Terminal', 'Arambagh Counter', 'Abdullahpur Terminal', 'Uttara Counter'],
  },
  'Dhaka→Feni': {
    boarding: ['Abdullahpur Terminal', 'Uttara Counter', 'Airport Counter', 'Maniknagar Terminal', 'Sayedabad Counter'],
    dropping: ['Mohipal Main Counter', 'Mohipal Flyover Counter', 'Feni Terminal'],
  },
  'Feni→Chattogram': {
    boarding: ['Mohipal Counter (CTG Route)', 'Lalpul Counter', 'Feni Terminal'],
    dropping: ['AK Khan Counter', 'Alankar Counter', 'Boropol Counter'],
  },
  "Feni→Cox's Bazar": {
    boarding: ["Mohipal Counter (Cox's Bazar)", 'Lalpul Counter', 'Feni Terminal'],
    dropping: ['Chakaria Counter', 'Central Terminal Counter', 'Sea Hill Counter'],
  },
  'Dhaka→Chattogram': {
    boarding: ['Abdullahpur Terminal', 'Maniknagar Terminal', 'Sayedabad Counter'],
    dropping: ['AK Khan Counter', 'Alankar Counter', 'Boropol Counter'],
  },
  "Chattogram→Cox's Bazar": {
    boarding: ['Boropol Counter', 'Alankar Counter'],
    dropping: ['Chakaria Counter', 'Central Terminal Counter', 'Sea Hill Counter'],
  },
  'Parshuram→Dhaka': {
    boarding: ['Parshuram Counter', 'Fulgazi Counter', 'Feni Terminal'],
    dropping: ['Sayedabad Counter', 'Maniknagar Terminal', 'Abdullahpur Terminal'],
  },
  'Feni→Lakshmipur': {
    boarding: ['Mohipal Counter (Lakshmipur)', 'Feni Terminal'],
    dropping: ['Raipur Counter', 'Lakshmipur Terminal'],
  },
  'Chhagalnaiya→Dhaka': {
    boarding: ['Chhagalnaiya Counter', 'Feni Terminal'],
    dropping: ['Sayedabad Counter', 'Maniknagar Terminal'],
  },
  "Dhaka→Cox's Bazar": {
    boarding: ['Abdullahpur Terminal', 'Maniknagar Terminal', 'Sayedabad Counter'],
    dropping: ['Chakaria Counter', 'Central Terminal Counter', 'Sea Hill Counter'],
  },
  'Dhaka→Sylhet': {
    boarding: ['Abdullahpur Terminal', 'Airport Counter', 'Maniknagar Terminal'],
    dropping: ['Sylhet Terminal', 'Sylhet City Center'],
  },
  'Dhaka→Comilla': {
    boarding: ['Sayedabad Counter', 'Maniknagar Terminal'],
    dropping: ['Comilla Terminal', 'Comilla City Center'],
  },
};

export function getRouteBoardingDropping(from: string, to: string) {
  const key = `${from}→${to}`;
  return routeBoardingDropping[key] || {
    boarding: [`${from} Terminal`, `${from} Counter`],
    dropping: [`${to} Terminal`, `${to} Counter`],
  };
}

export const coachTypes = [
  { name: 'Starline Platinum', type: 'AC' as const, seats: 36, amenities: ['AC', 'WiFi', 'USB Charging', 'Blanket', 'Snacks', 'Entertainment'] },
  { name: 'Starline Gold', type: 'AC' as const, seats: 40, amenities: ['AC', 'USB Charging', 'Reclining Seats', 'Water'] },
  { name: 'Starline Silver', type: 'AC' as const, seats: 41, amenities: ['AC', 'USB Charging', 'Water'] },
  { name: 'Starline Express', type: 'Non-AC' as const, seats: 40, amenities: ['Fan', 'Water'] },
];

export function generateBusResults(from: string, to: string, date: string): BusResult[] {
  const route = popularRoutes.find(r => r.from === from && r.to === to)
    || popularRoutes.find(r => r.to === from && r.from === to);

  const baseFareNonAC = route?.basePrice || 550;
  const baseFareAC = route?.acPrice || 850;
  const baseDuration = route?.duration || '4h 00m';

  const durationHours = parseInt(baseDuration.split('h')[0]);
  const durationMins = parseInt(baseDuration.split(' ')[1]?.replace('m', '') || '0');

  const { boarding, dropping } = getRouteBoardingDropping(from, to);

  // Generate realistic departures (not all times)
  const departures = ['06:00', '07:30', '09:00', '11:00', '14:00', '16:30', '18:30', '20:00', '22:00', '23:30'];

  return departures.map((dep, i) => {
    const coach = coachTypes[i % coachTypes.length];
    const depHour = parseInt(dep.split(':')[0]);
    const depMin = parseInt(dep.split(':')[1]);
    const totalMins = depHour * 60 + depMin + durationHours * 60 + durationMins;
    const arrHour = Math.floor(totalMins / 60) % 24;
    const arrMin = totalMins % 60;
    const fare = coach.type === 'AC' ? baseFareAC : baseFareNonAC;
    const seats = Math.floor(Math.random() * 25) + 3; // 3-27

    return {
      id: `bus-${i}`,
      routeId: route?.id || 'r1',
      from,
      to,
      departureTime: dep,
      arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
      duration: baseDuration,
      coachType: coach.type,
      coachName: coach.name,
      amenities: coach.amenities,
      availableSeats: seats,
      totalSeats: coach.seats,
      fare,
      boardingPoints: boarding,
      droppingPoints: dropping,
      date,
    };
  });
}

export const sampleBooking: Booking = {
  id: '1',
  bookingId: 'STR-2026-48291',
  busId: 'bus-0',
  from: 'Feni',
  to: 'Dhaka',
  date: '2026-03-25',
  departureTime: '22:00',
  arrivalTime: '02:00',
  passengerName: 'Rahim Uddin',
  phone: '+8801712345678',
  email: 'rahim@email.com',
  seats: ['A1', 'A2'],
  totalFare: 1700,
  status: 'confirmed',
  coachType: 'AC',
  coachName: 'Starline Platinum',
  boardingPoint: 'Mohipal Main Counter',
  droppingPoint: 'Maniknagar Terminal',
  paymentMethod: 'bKash',
};

export const adminStats = {
  todayTrips: 42,
  activeTrips: 12,
  totalPassengers: 1847,
  revenue: 1256000,
  occupancyRate: 78,
  onTimeRate: 94,
  supportTickets: 7,
  delayedTrips: 2,
  departures: [
    { id: 'd1', route: 'Feni → Dhaka', time: '06:00', coach: 'Platinum-01', status: 'On Time', occupancy: 92, passengers: 34 },
    { id: 'd2', route: 'Feni → Chattogram', time: '07:30', coach: 'Gold-03', status: 'On Time', occupancy: 88, passengers: 32 },
    { id: 'd3', route: 'Dhaka → Feni', time: '08:00', coach: 'Silver-05', status: 'Delayed 15m', occupancy: 72, passengers: 29 },
    { id: 'd4', route: "Feni → Cox's Bazar", time: '09:00', coach: 'Gold-02', status: 'On Time', occupancy: 65, passengers: 23 },
    { id: 'd5', route: "Chattogram → Cox's Bazar", time: '10:00', coach: 'Platinum-04', status: 'Boarding', occupancy: 96, passengers: 23 },
    { id: 'd6', route: 'Parshuram → Dhaka', time: '11:00', coach: 'Express-08', status: 'Departed', occupancy: 80, passengers: 35 },
  ],
  revenueChart: [
    { day: 'Mon', revenue: 185000 },
    { day: 'Tue', revenue: 210000 },
    { day: 'Wed', revenue: 178000 },
    { day: 'Thu', revenue: 195000 },
    { day: 'Fri', revenue: 245000 },
    { day: 'Sat', revenue: 280000 },
    { day: 'Sun', revenue: 163000 },
  ],
};
