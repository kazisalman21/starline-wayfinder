import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, MapPin, Clock, CheckCircle2, MessageCircle } from 'lucide-react';
import { useSupportStore } from '@/data/supportData';

const tooltipStyle = {
  contentStyle: { background: 'hsl(222 25% 10%)', border: '1px solid hsl(222 20% 18%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' },
};

const COLORS = [
  'hsl(355, 70%, 42%)', 'hsl(42, 85%, 52%)', 'hsl(210, 75%, 52%)',
  'hsl(152, 60%, 40%)', 'hsl(280, 60%, 50%)', 'hsl(25, 80%, 50%)',
  'hsl(190, 70%, 45%)', 'hsl(0, 60%, 55%)', 'hsl(160, 50%, 45%)', 'hsl(300, 40%, 50%)',
];

export default function SupportAnalyticsTab() {
  const complaints = useSupportStore((s) => s.complaints);

  // By category
  const byCat = Object.entries(
    complaints.reduce((a, c) => ({ ...a, [c.category]: (a[c.category] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, fullName: name, value }))
    .sort((a, b) => b.value - a.value);

  // By route
  const byRoute = Object.entries(
    complaints.reduce((a, c) => ({ ...a, [c.route]: (a[c.route] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 18) + '…' : name, value }))
    .sort((a, b) => b.value - a.value);

  // By status
  const byStatus = Object.entries(
    complaints.reduce((a, c) => ({ ...a, [c.status]: (a[c.status] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // By priority
  const byPriority = Object.entries(
    complaints.reduce((a, c) => ({ ...a, [c.priority]: (a[c.priority] || 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Weekly trend (mock)
  const weeklyTrend = [
    { day: 'Mon', complaints: 3 }, { day: 'Tue', complaints: 5 }, { day: 'Wed', complaints: 2 },
    { day: 'Thu', complaints: 4 }, { day: 'Fri', complaints: 6 }, { day: 'Sat', complaints: 8 }, { day: 'Sun', complaints: 3 },
  ];

  const openCount = complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length;
  const avgResolution = '4.2 hrs';
  const topRoute = byRoute[0]?.name || 'N/A';
  const topCategory = byCat[0]?.fullName || 'N/A';

  const insightCards = [
    { label: 'Total Complaints', value: complaints.length, icon: MessageCircle, color: 'text-primary' },
    { label: 'Unresolved', value: openCount, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Avg Resolution', value: avgResolution, icon: Clock, color: 'text-blue-400' },
    { label: 'Top Route', value: topRoute, icon: MapPin, color: 'text-accent' },
    { label: 'Top Category', value: topCategory, icon: TrendingUp, color: 'text-red-400' },
    { label: 'Resolution Rate', value: `${Math.round((complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length / complaints.length) * 100)}%`, icon: CheckCircle2, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Support Analytics</h2>
        <p className="text-sm text-muted-foreground">Complaint insights and service quality metrics</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {insightCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 card-hover">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <div className="font-display text-lg font-bold truncate">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byCat} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis type="number" stroke="hsl(220 10% 55%)" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="hsl(220 10% 55%)" fontSize={10} width={120} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="hsl(355 70% 42%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Route */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Complaints by Route</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byRoute}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="name" stroke="hsl(220 10% 55%)" fontSize={10} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="hsl(42 85% 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Status Pie */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {byStatus.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {t.name} ({t.value})
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Weekly Complaint Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
              <XAxis dataKey="day" stroke="hsl(220 10% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="complaints" stroke="hsl(355 70% 42%)" strokeWidth={2} dot={{ fill: 'hsl(355 70% 42%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-red-500/60">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">Critical Alerts</span>
          </div>
          <p className="text-xs text-muted-foreground">{complaints.filter((c) => c.priority === 'Critical' && c.status !== 'Resolved' && c.status !== 'Closed').length} unresolved critical complaints require immediate attention.</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500/60">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Pending Review</span>
          </div>
          <p className="text-xs text-muted-foreground">{complaints.filter((c) => c.status === 'Submitted').length} complaints are waiting for initial review and assignment.</p>
        </div>
      </div>
    </div>
  );
}
