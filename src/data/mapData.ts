import type { MapStop, MapRoute, BusMarker } from '@/components/map/MapCanvas';
import type { FleetBus } from '@/components/map/FleetOverviewCard';
import type { RouteSelectorRoute } from '@/components/map/RouteSelector';

// ======= Route map coordinates (SVG space) =======

const feniDhakaStops: MapStop[] = [
  { id: 'fd-1', name: 'Star Line Main Terminal — Feni', shortName: 'Feni Terminal', x: 100, y: 300, type: 'terminal' },
  { id: 'fd-2', name: 'Chhagalnaiya Counter', shortName: 'Chhagalnaiya', x: 200, y: 260, type: 'boarding' },
  { id: 'fd-3', name: 'Parshuram Counter', shortName: 'Parshuram', x: 280, y: 220, type: 'boarding' },
  { id: 'fd-4', name: 'Comilla Rest Stop', shortName: 'Comilla Break', x: 420, y: 180, type: 'break' },
  { id: 'fd-5', name: 'Daudkandi Toll', shortName: 'Daudkandi', x: 550, y: 160, type: 'intermediate' },
  { id: 'fd-6', name: 'Abdullahpur Terminal', shortName: 'Abdullahpur', x: 720, y: 120, type: 'terminal' },
  { id: 'fd-7', name: 'Maniknagar Terminal', shortName: 'Maniknagar', x: 850, y: 100, type: 'terminal' },
];

const feniChittagongStops: MapStop[] = [
  { id: 'fc-1', name: 'Star Line Main Terminal — Feni', shortName: 'Feni Terminal', x: 100, y: 280, type: 'terminal' },
  { id: 'fc-2', name: 'Mirsarai', shortName: 'Mirsarai', x: 250, y: 240, type: 'intermediate' },
  { id: 'fc-3', name: 'Sitakunda', shortName: 'Sitakunda', x: 400, y: 210, type: 'intermediate' },
  { id: 'fc-4', name: 'Chittagong Terminal', shortName: 'Chittagong', x: 600, y: 180, type: 'terminal' },
];

const feniCoxsBazarStops: MapStop[] = [
  { id: 'fx-1', name: 'Star Line Main Terminal — Feni', shortName: 'Feni Terminal', x: 100, y: 200, type: 'terminal' },
  { id: 'fx-2', name: 'Chittagong Terminal', shortName: 'Chittagong', x: 350, y: 230, type: 'dropping' },
  { id: 'fx-3', name: 'Chakaria', shortName: 'Chakaria', x: 520, y: 280, type: 'intermediate' },
  { id: 'fx-4', name: 'Cox\'s Bazar Terminal', shortName: 'Cox\'s Bazar', x: 700, y: 320, type: 'terminal' },
];

const feniLakshmipurStops: MapStop[] = [
  { id: 'fl-1', name: 'Star Line Main Terminal — Feni', shortName: 'Feni Terminal', x: 100, y: 250, type: 'terminal' },
  { id: 'fl-2', name: 'Sonagazi', shortName: 'Sonagazi', x: 250, y: 220, type: 'intermediate' },
  { id: 'fl-3', name: 'Lakshmipur Terminal', shortName: 'Lakshmipur', x: 450, y: 200, type: 'terminal' },
];

// Add tracking status to Feni-Dhaka for live tracking demo
const feniDhakaTracking: MapStop[] = feniDhakaStops.map((s, i) => ({
  ...s,
  status: i <= 2 ? 'completed' as const : i === 3 ? 'current' as const : 'upcoming' as const,
}));

export const mapRoutes: MapRoute[] = [
  { id: 'feni-dhaka', name: 'Feni → Dhaka', stops: feniDhakaStops },
  { id: 'feni-chittagong', name: 'Feni → Chittagong', stops: feniChittagongStops },
  { id: 'feni-coxsbazar', name: 'Feni → Cox\'s Bazar', stops: feniCoxsBazarStops },
  { id: 'feni-lakshmipur', name: 'Feni → Lakshmipur', stops: feniLakshmipurStops },
];

export const trackingRoute: MapRoute = {
  id: 'feni-dhaka-live',
  name: 'Feni → Dhaka (Live)',
  stops: feniDhakaTracking,
};

export const liveBuses: BusMarker[] = [
  { id: 'bus-1', x: 380, y: 190, heading: 45, routeId: 'feni-dhaka', label: 'Platinum-07', status: 'on-time' },
];

export const fleetBuses: FleetBus[] = [
  { id: 'bus-1', x: 380, y: 190, heading: 45, routeId: 'feni-dhaka', label: 'Platinum-07', status: 'on-time', routeName: 'Feni → Dhaka', nextStop: 'Comilla Rest Stop', eta: '00:30 AM', progress: 45 },
  { id: 'bus-2', x: 300, y: 230, heading: 30, routeId: 'feni-chittagong', label: 'Express-12', status: 'on-time', routeName: 'Feni → Chittagong', nextStop: 'Sitakunda', eta: '01:15 AM', progress: 55 },
  { id: 'bus-3', x: 450, y: 260, heading: 60, routeId: 'feni-coxsbazar', label: 'Premium-03', status: 'delayed', routeName: 'Feni → Cox\'s Bazar', nextStop: 'Chakaria', eta: '02:30 AM', progress: 38 },
  { id: 'bus-4', x: 200, y: 230, heading: 20, routeId: 'feni-lakshmipur', label: 'Star-09', status: 'on-time', routeName: 'Feni → Lakshmipur', nextStop: 'Sonagazi', eta: '11:45 PM', progress: 30 },
  { id: 'bus-5', x: 650, y: 130, heading: 40, routeId: 'feni-dhaka', label: 'Platinum-11', status: 'early', routeName: 'Feni → Dhaka', nextStop: 'Abdullahpur Terminal', eta: '03:00 AM', progress: 78 },
];

export const routeSelectorData: RouteSelectorRoute[] = [
  { id: 'feni-dhaka', name: 'Feni → Dhaka', from: 'Feni', to: 'Dhaka', duration: '5h 30m', distance: '158 km', stops: 7 },
  { id: 'feni-chittagong', name: 'Feni → Chittagong', from: 'Feni', to: 'Chittagong', duration: '3h', distance: '106 km', stops: 4 },
  { id: 'feni-coxsbazar', name: 'Feni → Cox\'s Bazar', from: 'Feni', to: 'Cox\'s Bazar', duration: '6h', distance: '180 km', stops: 4 },
  { id: 'feni-lakshmipur', name: 'Feni → Lakshmipur', from: 'Feni', to: 'Lakshmipur', duration: '1h 30m', distance: '42 km', stops: 3 },
];
