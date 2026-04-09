import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Navigation, MapPin, Clock, Layers, Map, ChevronDown, ChevronUp, Wifi, Coffee, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapCanvas, { type MapStop } from '@/components/map/MapCanvas';
import TripStatusCard from '@/components/map/TripStatusCard';
import MapLegend from '@/components/map/MapLegend';
import StopDetailCard from '@/components/map/StopDetailCard';
import { trackingRoute, liveBuses } from '@/data/mapData';

const tripData = {
  bookingId: 'STR-2026-48291',
  busLabel: 'Starline Platinum-07',
  from: 'Feni',
  to: 'Dhaka (Maniknagar)',
  departureTime: '22:00',
  eta: '03:15 AM',
  status: 'in-transit' as const,
  currentLocation: 'Approaching Comilla Rest Stop',
  nextStop: 'Comilla Rest Stop',
  progress: 42,
  seatClass: 'AC Business',
  lastUpdate: '2 min ago',
};

const stopTimes: Record<string, { arrival: string; departure: string }> = {
  'fd-1': { arrival: '—', departure: '22:00' },
  'fd-2': { arrival: '22:20', departure: '22:22' },
  'fd-3': { arrival: '22:40', departure: '22:42' },
  'fd-4': { arrival: '00:30', departure: '00:45' },
  'fd-5': { arrival: '01:40', departure: '01:42' },
  'fd-6': { arrival: '02:45', departure: '02:48' },
  'fd-7': { arrival: '03:15', departure: '—' },
};

export default function LiveTracking() {
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [animatedBuses, setAnimatedBuses] = useState(liveBuses);

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses(prev => prev.map(bus => ({
        ...bus,
        x: bus.x + (Math.random() - 0.3) * 3,
        y: bus.y + (Math.random() - 0.5) * 1.5,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col">
        {/* Map area - takes full remaining space */}
        <div className="flex-1 relative">
          <MapCanvas
            routes={[trackingRoute]}
            activeBuses={animatedBuses}
            selectedRoute="feni-dhaka-live"
            onStopClick={(stop) => setSelectedStop(stop)}
            className="w-full h-full min-h-[400px]"
          />

          {/* Floating trip status - desktop */}
          <div className="absolute top-4 left-4 hidden lg:block z-10">
            <TripStatusCard
              routeName="Feni → Dhaka"
              busLabel={tripData.busLabel}
              bookingId={tripData.bookingId}
              status={tripData.status}
              currentLocation={tripData.currentLocation}
              nextStop={tripData.nextStop}
              eta={tripData.eta}
              progress={tripData.progress}
              from={tripData.from}
              to={tripData.to}
              departureTime={tripData.departureTime}
              seatClass={tripData.seatClass}
              lastUpdate={tripData.lastUpdate}
            />
          </div>

          {/* Stop detail popup */}
          <AnimatePresence>
            {selectedStop && (
              <div className="absolute top-4 right-4 z-10">
                <StopDetailCard
                  stop={selectedStop}
                  arrivalTime={stopTimes[selectedStop.id]?.arrival}
                  departureTime={stopTimes[selectedStop.id]?.departure}
                  boardingAllowed={['terminal', 'boarding', 'counter'].includes(selectedStop.type)}
                  droppingAllowed={['terminal', 'dropping'].includes(selectedStop.type)}
                  onClose={() => setSelectedStop(null)}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 hidden md:block">
            <MapLegend />
          </div>

          {/* Alert banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 lg:left-auto lg:translate-x-0 lg:top-auto lg:bottom-4 lg:right-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-xl backdrop-blur-lg"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-success font-medium">Running 15 min ahead of schedule</span>
            </motion.div>
          </div>
        </div>

        {/* Mobile bottom sheet */}
        <motion.div
          className="lg:hidden bg-card border-t border-border/30 rounded-t-2xl relative z-20"
          animate={{ height: showBottomSheet ? 'auto' : '56px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Handle */}
          <button
            onClick={() => setShowBottomSheet(!showBottomSheet)}
            className="w-full flex flex-col items-center pt-2 pb-1"
          >
            <div className="w-10 h-1 rounded-full bg-border mb-2" />
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Bus className="w-3.5 h-3.5 text-primary" />
              <span>{tripData.busLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">{tripData.status === 'in-transit' ? 'In Transit' : tripData.status}</span>
              {showBottomSheet ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showBottomSheet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 pb-6 space-y-4"
            >
              {/* Current location */}
              <div className="bg-secondary/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
                  <span className="text-xs font-medium">{tripData.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Next: {tripData.nextStop}</span>
                  <span>ETA {tripData.eta}</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">{tripData.from}</span>
                  <span className="font-medium">{tripData.to}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tripData.progress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(355, 70%, 42%), hsl(42, 85%, 52%))' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{tripData.departureTime}</span>
                  <span className="text-accent font-semibold">{tripData.progress}%</span>
                  <span>{tripData.eta}</span>
                </div>
              </div>

              {/* Route stops */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-3">Route Progress</h4>
                <div className="space-y-0">
                  {trackingRoute.stops.map((stop, i) => (
                    <div key={stop.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                          stop.status === 'completed' ? 'bg-success border-success' :
                          stop.status === 'current' ? 'bg-primary border-primary animate-pulse-glow' :
                          'bg-transparent border-border'
                        }`}>
                          {stop.status === 'completed' && <CheckCircle2 className="w-2 h-2 text-white" />}
                        </div>
                        {i < trackingRoute.stops.length - 1 && (
                          <div className={`w-0.5 h-8 ${stop.status === 'completed' ? 'bg-success' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-4 -mt-0.5">
                        <div className={`font-medium text-xs ${
                          stop.status === 'current' ? 'text-primary' :
                          stop.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                        }`}>{stop.shortName}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {stopTimes[stop.id]?.arrival !== '—' ? stopTimes[stop.id]?.arrival : stopTimes[stop.id]?.departure}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Wifi, label: 'WiFi' },
                  { icon: Coffee, label: 'Refreshments' },
                  { icon: Phone, label: 'Driver' },
                ].map((s, i) => (
                  <div key={i} className="bg-secondary/30 rounded-lg p-2.5 text-center">
                    <s.icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
