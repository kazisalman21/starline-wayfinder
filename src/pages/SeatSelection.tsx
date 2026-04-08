import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, User, MapPin, Shield, Headphones, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRouteBoardingDropping } from '@/data/mockData';

// Starline real bus seat layout
const seatLayout = [
  ['A', '', '', '', ''],
  ['A1', 'A2', '', 'A3', 'A4'],
  ['B1', 'B2', '', 'B3', 'B4'],
  ['C1', 'C2', '', 'C3', 'C4'],
  ['D1', 'D2', '', 'D3', 'D4'],
  ['E1', 'E2', '', 'E3', 'E4'],
  ['F1', 'F2', '', 'F3', 'F4'],
  ['G1', 'G2', '', 'G3', 'G4'],
  ['H1', 'H2', '', 'H3', 'H4'],
  ['I1', 'I2', '', 'I3', 'I4'],
  ['J1', 'J2', 'J5', 'J3', 'J4'],
];

const unavailable = ['B3', 'C1', 'D4', 'F2', 'G3', 'H1', 'I4', 'J3'];
const ladies = ['A3', 'A4'];

export default function SeatSelection() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') || 'Feni';
  const to = params.get('to') || 'Dhaka';
  const date = params.get('date') || '2026-04-08';
  const fare = Number(params.get('fare') || 850);
  const coachName = params.get('coachName') || 'Starline Platinum';
  const coachType = params.get('coachType') || 'AC';
  const dep = params.get('dep') || '22:00';
  const arr = params.get('arr') || '02:00';
  const duration = params.get('duration') || '4h 00m';
  const passengers = Number(params.get('passengers') || 1);

  const { boarding: boardingOptions, dropping: droppingOptions } = useMemo(
    () => getRouteBoardingDropping(from, to),
    [from, to]
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState(boardingOptions[0]);
  const [droppingPoint, setDroppingPoint] = useState(droppingOptions[0]);
  const [passengerName, setPassengerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const toggleSeat = (seat: string) => {
    if (unavailable.includes(seat)) return;
    if (selected.includes(seat)) {
      setSelected(selected.filter(s => s !== seat));
    } else if (selected.length < passengers) {
      setSelected([...selected, seat]);
    }
  };

  const totalFare = selected.length * fare;
  const canProceed = selected.length > 0 && passengerName.trim() && phone.trim();

  const proceed = () => {
    navigate(`/checkout?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&seats=${selected.join(',')}&fare=${totalFare}&coachName=${encodeURIComponent(coachName)}&coachType=${encodeURIComponent(coachType)}&dep=${dep}&arr=${arr}&duration=${encodeURIComponent(duration)}&boarding=${encodeURIComponent(boardingPoint)}&dropping=${encodeURIComponent(droppingPoint)}&name=${encodeURIComponent(passengerName)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <h1 className="font-display text-2xl font-bold mb-2">Select Your Seats</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {from} → {to} • {coachName} ({coachType}) • {dep} – {arr} • {duration}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Map */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-6 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-secondary border border-border" /> Available</div>
                  <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-primary" /> Selected</div>
                  <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-muted opacity-40" /> Sold</div>
                  <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-pink-900/30 border border-pink-700/30" /> Ladies</div>
                </div>

                <div className="flex justify-center">
                  <div className="relative w-[280px]">
                    <div className="bg-secondary/30 border-2 border-border/60 rounded-t-[60px] rounded-b-2xl overflow-hidden">
                      <div className="bg-secondary/50 border-b border-border/40 px-6 pt-8 pb-4 rounded-t-[58px]">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Driver</span>
                          <div className="w-10 h-7 rounded-md bg-muted/50 border border-border/50 flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground">🚪</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 flex flex-col gap-1.5">
                        {seatLayout.map((row, ri) => (
                          <div key={ri} className="flex items-center justify-center gap-1">
                            {row.map((seat, si) => {
                              if (!seat) return (
                                <div key={si} className="w-11 flex items-center justify-center">
                                  <div className="w-[2px] h-8 bg-border/30 rounded-full" />
                                </div>
                              );
                              const isUnavailable = unavailable.includes(seat);
                              const isSelected = selected.includes(seat);
                              const isLadies = ladies.includes(seat);
                              return (
                                <motion.button
                                  key={si}
                                  whileTap={{ scale: 0.92 }}
                                  whileHover={!isUnavailable ? { scale: 1.08 } : {}}
                                  onClick={() => toggleSeat(seat)}
                                  disabled={isUnavailable}
                                  className={`w-11 h-10 rounded-lg text-[10px] font-semibold transition-all flex flex-col items-center justify-center relative ${
                                    isUnavailable
                                      ? 'bg-muted/30 text-muted-foreground/20 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50'
                                      : isLadies
                                      ? 'bg-pink-900/25 border border-pink-700/30 text-pink-300 hover:bg-pink-900/40'
                                      : 'bg-secondary border border-border text-foreground hover:border-primary/50 hover:bg-secondary/80'
                                  }`}
                                >
                                  <div className={`absolute top-0 left-1 right-1 h-[3px] rounded-t-lg ${
                                    isUnavailable ? 'bg-muted-foreground/10' : isSelected ? 'bg-primary-foreground/30' : 'bg-border'
                                  }`} />
                                  <span className="mt-1">{seat}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="h-3 bg-secondary/50 border-t border-border/40" />
                    </div>
                    <div className="absolute -left-3 top-[52px] w-3 h-8 bg-secondary/60 border border-border/40 rounded-l-full" />
                    <div className="absolute -right-3 top-[52px] w-3 h-8 bg-secondary/60 border border-border/40 rounded-r-full" />
                    <div className="absolute -left-2 top-[120px] w-3 h-10 bg-muted-foreground/30 rounded-full" />
                    <div className="absolute -right-2 top-[120px] w-3 h-10 bg-muted-foreground/30 rounded-full" />
                    <div className="absolute -left-2 bottom-[40px] w-3 h-10 bg-muted-foreground/30 rounded-full" />
                    <div className="absolute -right-2 bottom-[40px] w-3 h-10 bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Boarding/Dropping — Route Aware */}
              <div className="glass-card p-6 mt-6">
                <h3 className="font-display font-semibold mb-4">Boarding & Dropping Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Boarding Point</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <select value={boardingPoint} onChange={e => setBoardingPoint(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg pl-10 pr-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                        {boardingOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dropping Point</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                      <select value={droppingPoint} onChange={e => setDroppingPoint(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg pl-10 pr-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                        {droppingOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="glass-card p-6 mt-6">
                <h3 className="font-display font-semibold mb-4">Passenger Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={passengerName} onChange={e => setPassengerName(e.target.value)} placeholder="Enter full name" className="w-full bg-secondary text-foreground rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Summary */}
            <div>
              <div className="glass-card-accent p-6 sticky top-24">
                <h3 className="font-display font-semibold mb-4">Fare Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Coach</span><span>{coachName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{coachType}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span>{from} → {to}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{date}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{dep} – {arr}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Selected</span><span>{selected.length > 0 ? selected.join(', ') : 'None'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fare / seat</span><span>৳{fare}</span></div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent">৳{totalFare}</span>
                  </div>
                </div>
                <button
                  onClick={proceed}
                  disabled={!canProceed}
                  className="w-full mt-6 bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm hover:bg-primary/90 transition-colors btn-primary-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ChevronRight className="w-4 h-4" />
                </button>
                {selected.length === 0 && <p className="text-xs text-muted-foreground mt-2 text-center">Select at least one seat</p>}
                {selected.length > 0 && !passengerName.trim() && <p className="text-xs text-destructive mt-2 text-center">Enter passenger name to proceed</p>}

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-success" /> Secure</span>
                  <span className="flex items-center gap-1"><Headphones className="w-3.5 h-3.5" /> 24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
