import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Snowflake, Wifi, Zap, Coffee, Users, Armchair, Star, Bus, MapPin, Clock, ArrowRight, Navigation, Phone, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/notices/AnnouncementBar';
import { popularRoutes, coachTypes } from '@/data/mockData';
import { routes as routeData, terminals } from '@/data/routeCounters';

const safetyFeatures = [
  { icon: Shield, title: 'GPS Tracked', desc: 'All coaches are GPS tracked 24/7 for your safety' },
  { icon: Users, title: 'Trained Drivers', desc: 'Professional drivers with 10+ years experience' },
  { icon: Star, title: 'Regular Maintenance', desc: 'Coaches serviced every 5,000 km' },
  { icon: Bus, title: 'Insurance Coverage', desc: 'Full passenger insurance on every trip' },
];

const amenityMap: Record<string, typeof Wifi> = {
  'AC': Snowflake, 'WiFi': Wifi, 'USB Charging': Zap, 'Snacks': Coffee,
  'Blanket': Armchair, 'Entertainment': Star, 'Reclining Seats': Armchair,
  'Water': Coffee, 'Fan': Snowflake,
};

const counterTypeColor: Record<string, string> = {
  'Starting Point': 'bg-primary/15 text-primary',
  'Counter': 'bg-secondary text-muted-foreground',
  'Break (20 min)': 'bg-warning/15 text-warning',
  'Last Stop': 'bg-accent/15 text-accent',
};

export default function RoutesFleet() {
  const [selectedRoute, setSelectedRoute] = useState(routeData[0]?.id || '');
  const [routeFilter, setRouteFilter] = useState('all');

  const activeRoute = routeData.find(r => r.id === selectedRoute);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Hero */}
          <div className="mb-12">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">Star Line Network</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Routes & Fleet</h1>
            <p className="text-muted-foreground max-w-xl">Explore Star Line's intercity route network, terminal stops, and premium coach fleet.</p>
          </div>

          {/* Route Explorer */}
          <section className="mb-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Route Explorer</h2>
              <span className="text-sm text-muted-foreground">{routeData.length} routes</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Route List */}
              <div className="space-y-2 lg:col-span-1">
                {routeData.map((route, i) => (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedRoute(route.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedRoute === route.id
                        ? 'bg-primary/8 border-primary/30'
                        : 'bg-card/50 border-border/30 hover:border-border/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{route.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-semibold">{route.to}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{route.counters.length} stops</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        route.counters.some(c => c.status === 'Unconfirmed')
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}>
                        {route.counters.some(c => c.status === 'Unconfirmed') ? 'Unconfirmed' : 'Active'}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Route Detail / Timeline */}
              <div className="lg:col-span-2">
                {activeRoute ? (
                  <motion.div
                    key={activeRoute.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-display text-xl font-bold">{activeRoute.from} → {activeRoute.to}</h3>
                        <p className="text-xs text-muted-foreground">{activeRoute.counters.length} stops on this route</p>
                      </div>
                      <Link
                        to={`/search?from=${encodeURIComponent(activeRoute.from.replace(' Terminal', '').replace(' Counter', ''))}&to=${encodeURIComponent(activeRoute.to.replace(' Terminal', '').replace(' Counter', ''))}&date=2026-04-08&passengers=1`}
                        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors btn-primary-glow flex items-center gap-1"
                      >
                        Search Trips <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Route Timeline */}
                    <div className="relative">
                      {activeRoute.counters.map((counter, i) => {
                        const isFirst = i === 0;
                        const isLast = i === activeRoute.counters.length - 1;
                        const isBreak = counter.type === 'Break (20 min)';

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex gap-4 mb-0 last:mb-0"
                          >
                            {/* Timeline line */}
                            <div className="flex flex-col items-center w-8 shrink-0">
                              <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${
                                isFirst ? 'bg-primary border-primary' :
                                isLast ? 'bg-accent border-accent' :
                                isBreak ? 'bg-warning border-warning' :
                                'bg-secondary border-border'
                              }`} />
                              {!isLast && <div className="w-px flex-1 bg-border/50 min-h-[32px]" />}
                            </div>

                            {/* Counter info */}
                            <div className={`flex-1 pb-4 ${isLast ? 'pb-0' : ''}`}>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium">{counter.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${counterTypeColor[counter.type] || 'bg-secondary text-muted-foreground'}`}>
                                  {counter.type}
                                </span>
                                {counter.status !== 'Active' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
                                    {counter.status}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {counter.location}</span>
                                {counter.phone !== '—' && (
                                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {counter.phone}</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card p-10 text-center">
                    <Navigation className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Select a route to see its stop sequence</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Popular Routes Quick Cards */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-6">Popular Routes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularRoutes.slice(0, 8).map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&date=2026-04-08&passengers=1`}
                    className="glass-card p-5 block card-hover group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-sm">{route.from}</span>
                      <ChevronRight className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">{route.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.duration}</span>
                      <span className="flex items-center gap-1">{route.distance}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">from</span>
                      <div>
                        <span className="text-accent font-bold">৳{route.basePrice}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-primary font-bold">৳{route.acPrice}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">AC</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Fleet */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-2">Our Fleet</h2>
            <p className="text-muted-foreground text-sm mb-6">Premium coaches built for comfort and safety</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coachTypes.map((coach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-elevated p-6 card-hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg">{coach.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          coach.type === 'AC' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                        }`}>{coach.type}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Armchair className="w-3 h-3" /> {coach.seats} seats
                        </span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-secondary/60 flex items-center justify-center">
                      <Bus className="w-7 h-7 text-primary/60" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coach.amenities.map(a => {
                      const Icon = amenityMap[a] || Star;
                      return (
                        <span key={a} className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs text-muted-foreground">
                          <Icon className="w-3 h-3" /> {a}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-6">Safety & Reliability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {safetyFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 text-center card-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
