import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Wifi, Snowflake, Zap, ChevronRight, Filter, ArrowUpDown, Coffee, AlertTriangle, Bus, Armchair, Search, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import AnnouncementBar from '@/components/notices/AnnouncementBar';
import BookingNoticeInline from '@/components/notices/BookingNoticeInline';
import { useNoticeStore, getBookingFlowNotices } from '@/data/noticeData';
import { generateBusResults, popularRoutes, type BusResult } from '@/data/mockData';

const amenityIcons: Record<string, typeof Wifi> = {
  'AC': Snowflake, 'WiFi': Wifi, 'USB Charging': Zap, 'Snacks': Coffee, 'Fan': Snowflake,
};

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') || 'Feni';
  const to = params.get('to') || 'Dhaka';
  const date = params.get('date') || '2026-04-08';
  const passengers = Number(params.get('passengers') || 1);

  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('departure');
  const [filterType, setFilterType] = useState<string>('all');
  const { notices } = useNoticeStore();
  const routeStr = `${from} → ${to}`;
  const bookingNotices = getBookingFlowNotices(notices, routeStr);

  const results = useMemo(() => generateBusResults(from, to, date), [from, to, date]);

  const filtered = useMemo(() => {
    let r = filterType === 'all' ? results : results.filter(b => b.coachType === filterType);
    if (sortBy === 'price') r = [...r].sort((a, b) => a.fare - b.fare);
    if (sortBy === 'departure') r = [...r].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    return r;
  }, [results, sortBy, filterType]);

  const selectBus = (bus: BusResult) => {
    navigate(`/seat-selection?busId=${bus.id}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&passengers=${passengers}&fare=${bus.fare}&coachName=${encodeURIComponent(bus.coachName)}&coachType=${encodeURIComponent(bus.coachType)}&dep=${bus.departureTime}&arr=${bus.arrivalTime}&duration=${encodeURIComponent(bus.duration)}`);
  };

  // Suggested nearby routes if no results
  const suggestedRoutes = popularRoutes
    .filter(r => (r.from === from || r.to === to || r.from === to || r.to === from) && !(r.from === from && r.to === to))
    .slice(0, 4);

  const acCount = results.filter(b => b.coachType === 'AC').length;
  const nonAcCount = results.filter(b => b.coachType === 'Non-AC').length;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <SearchForm variant="compact" initialFrom={from} initialTo={to} initialDate={date} />

          {bookingNotices.length > 0 && (
            <div className="mt-6">
              <BookingNoticeInline notices={bookingNotices} />
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold">{from} → {to}</h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} trips available • {date} • {acCount} AC, {nonAcCount} Non-AC
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-secondary text-foreground text-sm rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="all">All Types</option>
                  <option value="AC">AC Only ({acCount})</option>
                  <option value="Non-AC">Non-AC Only ({nonAcCount})</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-secondary text-foreground text-sm rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="departure">Departure</option>
                  <option value="price">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((bus, i) => {
                const lowSeats = bus.availableSeats <= 8;
                return (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card p-5 card-hover"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Coach + Time */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-sm font-semibold text-primary">{bus.coachName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            bus.coachType === 'AC'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary text-muted-foreground'
                          }`}>
                            {bus.coachType}
                          </span>
                          {lowSeats && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {bus.availableSeats} seats left
                            </span>
                          )}
                        </div>

                        {/* Time row */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-center min-w-[56px]">
                            <div className="font-display text-xl font-bold">{bus.departureTime}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[80px]">{from}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {bus.duration}
                            </div>
                            <div className="w-full h-px bg-border relative">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
                            </div>
                          </div>
                          <div className="text-center min-w-[56px]">
                            <div className="font-display text-xl font-bold">{bus.arrivalTime}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[80px]">{to}</div>
                          </div>
                        </div>

                        {/* Boarding/Dropping + Amenities */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              {bus.boardingPoints[0]}
                            </span>
                            <ArrowRight className="w-3 h-3 hidden sm:block" />
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-accent" />
                              {bus.droppingPoints[0]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {bus.amenities.slice(0, 4).map(a => {
                            const Icon = amenityIcons[a] || Clock;
                            return (
                              <span key={a} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon className="w-3 h-3" /> {a}
                              </span>
                            );
                          })}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Armchair className="w-3 h-3" /> {bus.totalSeats} seats
                          </span>
                        </div>
                      </div>

                      {/* Right: Price + CTA */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:gap-2 lg:min-w-[140px]">
                        {!lowSeats && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{bus.availableSeats} seats</span>
                          </div>
                        )}
                        <div className="font-display text-2xl font-bold text-accent">৳{bus.fare}</div>
                        <button
                          onClick={() => selectBus(bus)}
                          className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors btn-primary-glow flex items-center gap-1 whitespace-nowrap"
                        >
                          Select Seats <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-5">
                <Bus className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">No Trips Found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                We couldn't find any {filterType !== 'all' ? filterType + ' ' : ''}trips from {from} to {to} on {date}.
                {filterType !== 'all' && ' Try selecting "All Types" to see more options.'}
              </p>

              {filterType !== 'all' && (
                <button
                  onClick={() => setFilterType('all')}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors mb-6"
                >
                  <Search className="w-4 h-4" /> Show All Types
                </button>
              )}

              {/* Suggest alternate dates */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-3">Try nearby dates:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {[-1, 1, 2].map(offset => {
                    const d = new Date(date);
                    d.setDate(d.getDate() + offset);
                    const altDate = d.toISOString().split('T')[0];
                    return (
                      <Link
                        key={offset}
                        to={`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${altDate}&passengers=${passengers}`}
                        className="flex items-center gap-1.5 bg-secondary px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Calendar className="w-3 h-3" /> {altDate}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Suggested routes */}
              {suggestedRoutes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">Or try these routes:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedRoutes.map(r => (
                      <Link
                        key={r.id}
                        to={`/search?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}&date=${date}&passengers=${passengers}`}
                        className="flex items-center gap-1.5 bg-secondary px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        {r.from} → {r.to}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
