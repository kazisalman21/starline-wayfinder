import { create } from 'zustand';
import type { Counter, CounterStatus, RouteData, RouteStatus } from './types';
import { terminals, routes as csvRoutes } from './routeCounters';
import type { Counter as CsvCounter } from './routeCounters';

// Generate IDs
let _counterId = 100;
let _routeId = 100;
let _pointId = 1000;
export const generateCounterId = () => `C${++_counterId}`;
export const generateRouteId = () => `R${++_routeId}`;
export const generatePointId = () => `P${++_pointId}`;

const isBreakType = (type: string) => type === 'Break (20 min)';

// Seed counters from existing routeCounters data
const seedCounters: Counter[] = terminals.map((t, i) => ({
  id: `C${i + 1}`,
  code: t.id.toUpperCase(),
  name: t.name,
  type: t.isMainTerminal ? 'Main Terminal' as const : 'Counter' as const,
  district: t.district,
  address: t.location,
  phone: t.phone,
  notes: '',
  mapLocation: `${t.lat}, ${t.lng}`,
  status: 'active' as const,
  isMainTerminal: t.isMainTerminal,
  createdAt: '2026-01-01',
  updatedAt: '2026-03-25',
}));

// Seed routes from existing routeCounters data
const seedRoutes: RouteData[] = csvRoutes.map((r, i) => ({
  id: `R${i + 1}`,
  code: r.id.toUpperCase(),
  name: `${r.from} → ${r.to}`,
  from: r.from,
  to: r.to,
  direction: 'Outbound',
  estimatedDuration: '',
  baseFare: 0,
  status: 'active' as const,
  notes: '',
  points: r.counters.map((c: CsvCounter, ci: number) => ({
    id: `P${i * 100 + ci}`,
    routeId: `R${i + 1}`,
    orderIndex: ci + 1,
    pointType: ci === 0 ? 'Origin Terminal' as const : ci === r.counters.length - 1 ? 'Destination Terminal' as const : isBreakType(c.type) ? 'Break Point' as const : 'Counter' as const,
    counterId: null,
    customPointName: c.name,
    haltMinutes: isBreakType(c.type) ? 0 : 5,
    breakMinutes: isBreakType(c.type) ? 20 : 0,
    isBoardingAllowed: !isBreakType(c.type),
    isDroppingAllowed: !isBreakType(c.type),
    isVisibleToCustomer: true,
    status: 'active' as const,
    notes: '',
  })),
  createdAt: '2026-01-01',
  updatedAt: '2026-03-25',
}));

interface StoreState {
  counters: Counter[];
  routes: RouteData[];
  addCounter: (data: Omit<Counter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCounter: (id: string, data: Partial<Counter>) => void;
  setCounterStatus: (id: string, status: CounterStatus) => void;
  getCounterById: (id: string) => Counter | undefined;
  getCounterUsageCount: (id: string) => number;
  addRoute: (data: Omit<RouteData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoute: (id: string, data: Partial<RouteData>) => void;
  deleteRoute: (id: string) => void;
  setRouteStatus: (id: string, status: RouteStatus) => void;
  duplicateRoute: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  counters: seedCounters,
  routes: seedRoutes,

  addCounter: (data) => set(s => ({
    counters: [...s.counters, { ...data, id: generateCounterId(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) }],
  })),

  updateCounter: (id, data) => set(s => ({
    counters: s.counters.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : c),
  })),

  setCounterStatus: (id, status) => set(s => ({
    counters: s.counters.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString().slice(0, 10) } : c),
  })),

  getCounterById: (id) => get().counters.find(c => c.id === id),

  getCounterUsageCount: (id) => get().routes.filter(r => r.points.some(p => p.counterId === id)).length,

  addRoute: (data) => set(s => ({
    routes: [...s.routes, { ...data, id: generateRouteId(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) } as RouteData],
  })),

  updateRoute: (id, data) => set(s => ({
    routes: s.routes.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : r),
  })),

  deleteRoute: (id) => set(s => ({ routes: s.routes.filter(r => r.id !== id) })),

  setRouteStatus: (id, status) => set(s => ({
    routes: s.routes.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString().slice(0, 10) } : r),
  })),

  duplicateRoute: (id) => {
    const route = get().routes.find(r => r.id === id);
    if (!route) return;
    const newId = generateRouteId();
    set(s => ({
      routes: [...s.routes, {
        ...route,
        id: newId,
        code: `${route.code}-COPY`,
        name: `${route.name} (Copy)`,
        status: 'draft' as RouteStatus,
        points: route.points.map(p => ({ ...p, id: generatePointId(), routeId: newId })),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }],
    }));
  },
}));
