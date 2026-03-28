import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
  Bus, Users, DollarSign, Clock, AlertTriangle, Headphones, TrendingUp, MapPin,
  Plus, Pencil, Trash2, Search, Filter, Eye, X, Check, ChevronRight,
  LayoutDashboard, Route, Building2, UserCog, Ticket, Settings, Shield,
  Phone, Mail, Calendar, Fuel, Wrench, Star, Download, MoreVertical, Power
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { adminStats, coachTypes } from '@/data/mockData';
import { terminals, routes as routeData } from '@/data/routeCounters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- Admin Tab Types ---
type AdminTab = 'overview' | 'fleet' | 'counters' | 'routes' | 'bookings' | 'drivers' | 'settings';

const adminTabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'fleet', label: 'Fleet', icon: Bus },
  { id: 'counters', label: 'Counters', icon: Building2 },
  { id: 'routes', label: 'Routes', icon: Route },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'drivers', label: 'Drivers', icon: UserCog },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// --- Mock Fleet Data ---
const fleetData = [
  { id: 'B001', regNo: 'Dhaka Metro-Ga-12-3456', name: 'Starline Platinum-01', type: 'AC Sleeper', seats: 24, status: 'active', lastService: '2026-03-15', mileage: 125400, fuelType: 'Diesel', driver: 'Karim Uddin', route: 'Dhaka → Chattogram' },
  { id: 'B002', regNo: 'Dhaka Metro-Ga-14-7890', name: 'Starline Gold-03', type: 'AC Business', seats: 36, status: 'active', lastService: '2026-03-10', mileage: 98200, fuelType: 'Diesel', driver: 'Rafiq Hossain', route: 'Dhaka → Cox\'s Bazar' },
  { id: 'B003', regNo: 'Dhaka Metro-Ga-15-2345', name: 'Starline Silver-05', type: 'AC Economy', seats: 40, status: 'maintenance', lastService: '2026-03-20', mileage: 145600, fuelType: 'Diesel', driver: 'Alam Sheikh', route: 'Dhaka → Sylhet' },
  { id: 'B004', regNo: 'Dhaka Metro-Ga-16-6789', name: 'Starline Gold-02', type: 'AC Business', seats: 36, status: 'active', lastService: '2026-03-08', mileage: 110300, fuelType: 'Diesel', driver: 'Hasan Ali', route: 'Dhaka → Rajshahi' },
  { id: 'B005', regNo: 'Dhaka Metro-Ga-17-1234', name: 'Starline Platinum-04', type: 'AC Sleeper', seats: 24, status: 'active', lastService: '2026-03-18', mileage: 87500, fuelType: 'Diesel', driver: 'Jamal Mia', route: 'Chattogram → Cox\'s Bazar' },
  { id: 'B006', regNo: 'Dhaka Metro-Ga-18-5678', name: 'Starline Express-08', type: 'Non-AC', seats: 44, status: 'inactive', lastService: '2026-02-28', mileage: 201000, fuelType: 'Diesel', driver: 'Unassigned', route: 'Dhaka → Feni' },
  { id: 'B007', regNo: 'Dhaka Metro-Ga-19-9012', name: 'Starline Silver-11', type: 'AC Economy', seats: 40, status: 'active', lastService: '2026-03-22', mileage: 67800, fuelType: 'CNG', driver: 'Belal Hossain', route: 'Feni → Chittagong' },
  { id: 'B008', regNo: 'Dhaka Metro-Ga-20-3456', name: 'Starline Gold-06', type: 'AC Business', seats: 36, status: 'active', lastService: '2026-03-19', mileage: 92100, fuelType: 'Diesel', driver: 'Sumon Ahmed', route: 'Feni → Lakshmipur' },
];

// --- Mock Bookings Data ---
const bookingsData = [
  { id: 'STR-2026-48291', passenger: 'Rahim Uddin', phone: '01712345678', route: 'Dhaka → Chattogram', date: '2026-03-25', seats: ['A1', 'A2'], fare: 3740, status: 'confirmed', coach: 'Platinum-01', payment: 'bKash' },
  { id: 'STR-2026-48292', passenger: 'Fatema Begum', phone: '01898765432', route: 'Dhaka → Cox\'s Bazar', date: '2026-03-26', seats: ['B3'], fare: 1400, status: 'confirmed', coach: 'Gold-03', payment: 'Nagad' },
  { id: 'STR-2026-48293', passenger: 'Kamal Ahmed', phone: '01611223344', route: 'Feni → Chittagong', date: '2026-03-24', seats: ['C2', 'C3'], fare: 1200, status: 'completed', coach: 'Silver-05', payment: 'Card' },
  { id: 'STR-2026-48294', passenger: 'Nasrin Akter', phone: '01555667788', route: 'Dhaka → Sylhet', date: '2026-03-27', seats: ['A4'], fare: 800, status: 'confirmed', coach: 'Gold-02', payment: 'bKash' },
  { id: 'STR-2026-48295', passenger: 'Shahidul Islam', phone: '01744556677', route: 'Chattogram → Cox\'s Bazar', date: '2026-03-23', seats: ['D1'], fare: 600, status: 'cancelled', coach: 'Platinum-04', payment: 'Cash' },
  { id: 'STR-2026-48296', passenger: 'Ayesha Siddika', phone: '01933445566', route: 'Dhaka → Feni', date: '2026-03-28', seats: ['B1', 'B2'], fare: 1100, status: 'confirmed', coach: 'Express-08', payment: 'Nagad' },
];

// --- Mock Drivers Data ---
const driversData = [
  { id: 'D001', name: 'Karim Uddin', phone: '01712000001', license: 'DM-2024-001234', experience: '12 years', rating: 4.8, trips: 2340, status: 'on-duty', assignedBus: 'Platinum-01', photo: '' },
  { id: 'D002', name: 'Rafiq Hossain', phone: '01712000002', license: 'DM-2023-005678', experience: '8 years', rating: 4.6, trips: 1560, status: 'on-duty', assignedBus: 'Gold-03', photo: '' },
  { id: 'D003', name: 'Alam Sheikh', phone: '01712000003', license: 'DM-2022-009012', experience: '15 years', rating: 4.9, trips: 3100, status: 'off-duty', assignedBus: 'Silver-05', photo: '' },
  { id: 'D004', name: 'Hasan Ali', phone: '01712000004', license: 'DM-2025-003456', experience: '5 years', rating: 4.5, trips: 890, status: 'on-duty', assignedBus: 'Gold-02', photo: '' },
  { id: 'D005', name: 'Jamal Mia', phone: '01712000005', license: 'DM-2021-007890', experience: '18 years', rating: 4.7, trips: 4200, status: 'on-leave', assignedBus: 'Platinum-04', photo: '' },
  { id: 'D006', name: 'Belal Hossain', phone: '01712000006', license: 'DM-2024-002345', experience: '6 years', rating: 4.4, trips: 720, status: 'on-duty', assignedBus: 'Silver-11', photo: '' },
];

// --- Status Badges ---
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: 'bg-success/15 text-success',
    maintenance: 'bg-warning/15 text-warning',
    inactive: 'bg-destructive/15 text-destructive',
    confirmed: 'bg-success/15 text-success',
    completed: 'bg-info/15 text-info',
    cancelled: 'bg-destructive/15 text-destructive',
    'on-duty': 'bg-success/15 text-success',
    'off-duty': 'bg-muted-foreground/15 text-muted-foreground',
    'on-leave': 'bg-warning/15 text-warning',
    'On Time': 'bg-success/10 text-success',
    'Delayed 15m': 'bg-warning/10 text-warning',
    'Boarding': 'bg-info/10 text-info',
    'Departed': 'bg-primary/10 text-primary',
  };
  return map[status] || 'bg-secondary text-muted-foreground';
};

// --- Stat Cards Data ---
const statCards = [
  { icon: Bus, label: "Today's Trips", value: adminStats.todayTrips, color: 'text-primary' },
  { icon: MapPin, label: 'Active Trips', value: adminStats.activeTrips, color: 'text-success' },
  { icon: Users, label: 'Passengers', value: adminStats.totalPassengers.toLocaleString(), color: 'text-info' },
  { icon: DollarSign, label: 'Revenue (৳)', value: `${(adminStats.revenue / 1000).toFixed(0)}K`, color: 'text-accent' },
  { icon: TrendingUp, label: 'Occupancy', value: `${adminStats.occupancyRate}%`, color: 'text-primary' },
  { icon: Clock, label: 'On-Time', value: `${adminStats.onTimeRate}%`, color: 'text-success' },
  { icon: AlertTriangle, label: 'Delayed', value: adminStats.delayedTrips, color: 'text-warning' },
  { icon: Headphones, label: 'Support Issues', value: adminStats.supportTickets, color: 'text-destructive' },
];

// Pie chart data
const fleetTypePie = [
  { name: 'AC Sleeper', value: 2, color: 'hsl(355, 70%, 42%)' },
  { name: 'AC Business', value: 3, color: 'hsl(42, 85%, 52%)' },
  { name: 'AC Economy', value: 2, color: 'hsl(210, 75%, 52%)' },
  { name: 'Non-AC', value: 1, color: 'hsl(220, 10%, 50%)' },
];

const occupancyTrend = [
  { day: 'Mon', rate: 72 }, { day: 'Tue', rate: 78 }, { day: 'Wed', rate: 65 },
  { day: 'Thu', rate: 80 }, { day: 'Fri', rate: 92 }, { day: 'Sat', rate: 95 }, { day: 'Sun', rate: 68 },
];

// ===================== COMPONENT =====================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBus, setShowAddBus] = useState(false);
  const [showAddCounter, setShowAddCounter] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Form states
  const [busForm, setBusForm] = useState({ name: '', regNo: '', type: 'AC Business', seats: '36', fuelType: 'Diesel', driver: '' });
  const [counterForm, setCounterForm] = useState({ name: '', location: '', district: '', phone: '' });
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', license: '', experience: '' });

  const resetForms = () => {
    setBusForm({ name: '', regNo: '', type: 'AC Business', seats: '36', fuelType: 'Diesel', driver: '' });
    setCounterForm({ name: '', location: '', district: '', phone: '' });
    setDriverForm({ name: '', phone: '', license: '', experience: '' });
  };

  const tabContent: Record<AdminTab, JSX.Element> = {
    // ============= OVERVIEW =============
    overview: (
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-display text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={adminStats.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
                <XAxis dataKey="day" stroke="hsl(220 10% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 55%)" fontSize={12} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip contentStyle={{ background: 'hsl(222 25% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' }} formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(355 70% 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fleet Composition */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Fleet Composition</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={fleetTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {fleetTypePie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222 25% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {fleetTypePie.map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  {t.name} ({t.value})
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy Trend */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Occupancy Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
                <XAxis dataKey="day" stroke="hsl(220 10% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 55%)" fontSize={12} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: 'hsl(222 25% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(42 85% 52%)" strokeWidth={2} dot={{ fill: 'hsl(42 85% 52%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Departures */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Upcoming Departures</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {adminStats.departures.map((dep) => (
              <div key={dep.id} className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl">
                <div className="text-center min-w-[50px]"><div className="font-display font-bold">{dep.time}</div></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{dep.route}</div>
                  <div className="text-xs text-muted-foreground">{dep.coach} • {dep.passengers} pax</div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 bg-secondary rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${dep.occupancy}%` }} /></div>
                  <div className="text-xs text-muted-foreground text-center mt-0.5">{dep.occupancy}%</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge(dep.status)}`}>{dep.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    // ============= FLEET MANAGEMENT =============
    fleet: (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Fleet Management</h2>
            <p className="text-sm text-muted-foreground">{fleetData.length} buses in your fleet</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search buses..." className="pl-9 bg-secondary/50 border-border/40 sm:w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Button onClick={() => { resetForms(); setShowAddBus(true); }} className="btn-primary-glow shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Bus
            </Button>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Bus ID</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Type</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Reg. No</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Driver</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleetData.filter(b => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.regNo.toLowerCase().includes(searchQuery.toLowerCase())).map((bus, i) => (
                <motion.tr key={bus.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-secondary/20">
                  <TableCell className="font-mono text-xs text-muted-foreground">{bus.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{bus.name}</div>
                    <div className="text-xs text-muted-foreground">{bus.seats} seats • {bus.route}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-xs bg-secondary/60 px-2 py-1 rounded-md">{bus.type}</span></TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{bus.regNo}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{bus.driver}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(bus.status)}`}>{bus.status}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(bus); setShowViewDialog(true); }}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(bus.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Fleet Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Buses', value: fleetData.filter(b => b.status === 'active').length, icon: Power, color: 'text-success' },
            { label: 'In Maintenance', value: fleetData.filter(b => b.status === 'maintenance').length, icon: Wrench, color: 'text-warning' },
            { label: 'Inactive', value: fleetData.filter(b => b.status === 'inactive').length, icon: AlertTriangle, color: 'text-destructive' },
            { label: 'Total Fleet', value: fleetData.length, icon: Bus, color: 'text-primary' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4">
              <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
              <div className="font-display text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),

    // ============= COUNTERS / TERMINALS =============
    counters: (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Counter & Terminal Management</h2>
            <p className="text-sm text-muted-foreground">{terminals.length} terminals registered</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search terminals..." className="pl-9 bg-secondary/50 border-border/40 sm:w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Button onClick={() => { resetForms(); setShowAddCounter(true); }} className="btn-primary-glow shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Terminal
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {terminals.filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.district.toLowerCase().includes(searchQuery.toLowerCase())).map((terminal, i) => (
            <motion.div key={terminal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${terminal.isMainTerminal ? 'bg-primary/15' : 'bg-secondary/60'}`}>
                    <Building2 className={`w-5 h-5 ${terminal.isMainTerminal ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{terminal.name}</div>
                    <div className="text-xs text-muted-foreground">{terminal.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(terminal.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {terminal.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {terminal.district}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {terminal.isMainTerminal && <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">Main Terminal</span>}
                <span className="text-xs bg-success/15 text-success px-2 py-0.5 rounded-full font-medium">Active</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Routes associated */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Route-Counter Associations</h3>
          <div className="space-y-3">
            {routeData.slice(0, 5).map((route) => (
              <div key={route.id} className="flex items-center justify-between bg-secondary/30 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Route className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{route.from} → {route.to}</div>
                    <div className="text-xs text-muted-foreground">{route.counters.length} stops</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">{route.counters.filter(c => c.status === 'Active').length} active</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    // ============= ROUTES =============
    routes: (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Route Management</h2>
            <p className="text-sm text-muted-foreground">{routeData.length} routes configured</p>
          </div>
          <Button className="btn-primary-glow"><Plus className="w-4 h-4 mr-1" /> Add Route</Button>
        </div>

        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Route ID</TableHead>
                <TableHead className="text-muted-foreground">From</TableHead>
                <TableHead className="text-muted-foreground">To</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Stops</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeData.map((route, i) => (
                <motion.tr key={route.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-secondary/20">
                  <TableCell className="font-mono text-xs text-muted-foreground uppercase">{route.id}</TableCell>
                  <TableCell className="font-medium text-sm">{route.from}</TableCell>
                  <TableCell className="font-medium text-sm">{route.to}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs bg-secondary/60 px-2 py-1 rounded-md">{route.counters.length} stops</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${route.counters.some(c => c.status === 'Unverified') ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>
                      {route.counters.some(c => c.status === 'Unverified') ? 'Partially Verified' : 'Verified'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),

    // ============= BOOKINGS =============
    bookings: (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Booking Management</h2>
            <p className="text-sm text-muted-foreground">{bookingsData.length} recent bookings</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-9 bg-secondary/50 border-border/40 sm:w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" className="shrink-0"><Download className="w-4 h-4 mr-1" /> Export</Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Confirmed', value: bookingsData.filter(b => b.status === 'confirmed').length, color: 'text-success' },
            { label: 'Completed', value: bookingsData.filter(b => b.status === 'completed').length, color: 'text-info' },
            { label: 'Cancelled', value: bookingsData.filter(b => b.status === 'cancelled').length, color: 'text-destructive' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Booking ID</TableHead>
                <TableHead className="text-muted-foreground">Passenger</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Route</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Fare</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsData.filter(b => !searchQuery || b.passenger.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase())).map((booking, i) => (
                <motion.tr key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-secondary/20">
                  <TableCell className="font-mono text-xs text-primary">{booking.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{booking.passenger}</div>
                    <div className="text-xs text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{booking.route}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{booking.date}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium text-sm">৳{booking.fare.toLocaleString()}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(booking.status)}`}>{booking.status}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(booking); setShowViewDialog(true); }}><Eye className="w-4 h-4" /></Button>
                      {booking.status === 'confirmed' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><X className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),

    // ============= DRIVERS =============
    drivers: (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">Driver Management</h2>
            <p className="text-sm text-muted-foreground">{driversData.length} registered drivers</p>
          </div>
          <Button onClick={() => { resetForms(); setShowAddDriver(true); }} className="btn-primary-glow">
            <Plus className="w-4 h-4 mr-1" /> Add Driver
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {driversData.map((driver, i) => (
            <motion.div key={driver.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-secondary/60 flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-xs text-muted-foreground">{driver.license}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(driver.status)}`}>{driver.status.replace('-', ' ')}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div><span className="text-muted-foreground">Experience:</span> <span className="font-medium">{driver.experience}</span></div>
                <div><span className="text-muted-foreground">Total Trips:</span> <span className="font-medium">{driver.trips.toLocaleString()}</span></div>
                <div className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" /> <span className="font-medium">{driver.rating}</span></div>
                <div><span className="text-muted-foreground">Bus:</span> <span className="font-medium">{driver.assignedBus}</span></div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/20">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {driver.phone}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(driver.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),

    // ============= SETTINGS =============
    settings: (
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold">System Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'Company Profile', desc: 'Update Star Line Group brand details, logo, and contact info', icon: Building2 },
            { title: 'Fare Configuration', desc: 'Set base fares, peak pricing, and discount rules per route', icon: DollarSign },
            { title: 'Notification Settings', desc: 'SMS/email templates for booking, cancellation, and delay alerts', icon: Mail },
            { title: 'Access Control', desc: 'Manage admin roles, permissions, and staff accounts', icon: Shield },
            { title: 'Scheduling', desc: 'Configure departure schedules, seasonal timetables, and holidays', icon: Calendar },
            { title: 'Maintenance Alerts', desc: 'Set service intervals, mileage thresholds, and inspection reminders', icon: Wrench },
          ].map((setting, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 card-hover cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <setting.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{setting.title}</div>
                  <div className="text-xs text-muted-foreground">{setting.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground text-sm">Starline command center — manage everything</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-xs text-muted-foreground">Last updated</div>
              <div className="text-sm font-medium text-success">Live • Just now</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 overflow-x-auto scrollbar-hide bg-secondary/30 p-1.5 rounded-xl border border-border/30">
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="admin-tab-bg" className="absolute inset-0 bg-primary rounded-lg" style={{ zIndex: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ========== DIALOGS ========== */}

      {/* Add Bus Dialog */}
      <Dialog open={showAddBus} onOpenChange={setShowAddBus}>
        <DialogContent className="glass-card border-border/40">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Bus</DialogTitle>
            <DialogDescription>Register a new bus to the Starline fleet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">Bus Name</label><Input placeholder="e.g. Starline Gold-07" className="bg-secondary/50" value={busForm.name} onChange={e => setBusForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Registration No</label><Input placeholder="e.g. Dhaka Metro-Ga-21-1234" className="bg-secondary/50" value={busForm.regNo} onChange={e => setBusForm(p => ({ ...p, regNo: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">Coach Type</label>
                <select className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm" value={busForm.type} onChange={e => setBusForm(p => ({ ...p, type: e.target.value }))}>
                  {coachTypes.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Seats</label><Input type="number" className="bg-secondary/50" value={busForm.seats} onChange={e => setBusForm(p => ({ ...p, seats: e.target.value }))} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Fuel Type</label>
                <select className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm" value={busForm.fuelType} onChange={e => setBusForm(p => ({ ...p, fuelType: e.target.value }))}>
                  <option>Diesel</option><option>CNG</option><option>Electric</option>
                </select>
              </div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Assign Driver</label><Input placeholder="Driver name" className="bg-secondary/50" value={busForm.driver} onChange={e => setBusForm(p => ({ ...p, driver: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBus(false)}>Cancel</Button>
            <Button className="btn-primary-glow" onClick={() => setShowAddBus(false)}><Check className="w-4 h-4 mr-1" /> Add Bus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Counter Dialog */}
      <Dialog open={showAddCounter} onOpenChange={setShowAddCounter}>
        <DialogContent className="glass-card border-border/40">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Terminal</DialogTitle>
            <DialogDescription>Register a new counter or terminal location.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs text-muted-foreground mb-1 block">Terminal Name</label><Input placeholder="e.g. Tongi Star Line Counter" className="bg-secondary/50" value={counterForm.name} onChange={e => setCounterForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">Location</label><Input placeholder="e.g. Tongi Bus Stand" className="bg-secondary/50" value={counterForm.location} onChange={e => setCounterForm(p => ({ ...p, location: e.target.value }))} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">District</label><Input placeholder="e.g. Gazipur" className="bg-secondary/50" value={counterForm.district} onChange={e => setCounterForm(p => ({ ...p, district: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><Input placeholder="e.g. 01973-259700" className="bg-secondary/50" value={counterForm.phone} onChange={e => setCounterForm(p => ({ ...p, phone: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCounter(false)}>Cancel</Button>
            <Button className="btn-primary-glow" onClick={() => setShowAddCounter(false)}><Check className="w-4 h-4 mr-1" /> Add Terminal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Driver Dialog */}
      <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
        <DialogContent className="glass-card border-border/40">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Driver</DialogTitle>
            <DialogDescription>Register a driver to the Starline team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">Full Name</label><Input placeholder="e.g. Morshed Ali" className="bg-secondary/50" value={driverForm.name} onChange={e => setDriverForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><Input placeholder="e.g. 01712000010" className="bg-secondary/50" value={driverForm.phone} onChange={e => setDriverForm(p => ({ ...p, phone: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">License No</label><Input placeholder="e.g. DM-2026-001234" className="bg-secondary/50" value={driverForm.license} onChange={e => setDriverForm(p => ({ ...p, license: e.target.value }))} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Experience</label><Input placeholder="e.g. 10 years" className="bg-secondary/50" value={driverForm.experience} onChange={e => setDriverForm(p => ({ ...p, experience: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDriver(false)}>Cancel</Button>
            <Button className="btn-primary-glow" onClick={() => setShowAddDriver(false)}><Check className="w-4 h-4 mr-1" /> Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="glass-card border-border/40 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Details</DialogTitle>
            <DialogDescription>Full information view</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3 text-sm">
              {Object.entries(selectedItem).filter(([k]) => k !== 'id' && k !== 'photo').map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-right max-w-[60%] truncate">
                    {Array.isArray(value) ? (value as string[]).join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="glass-card border-border/40 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>This action cannot be undone. Are you sure you want to permanently delete this item?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(null)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
