import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Bus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapCanvas, { type MapStop } from '@/components/map/MapCanvas';
import RouteSelector from '@/components/map/RouteSelector';
import MapLegend from '@/components/map/MapLegend';
import StopDetailCard from '@/components/map/StopDetailCard';
import FleetOverviewCard from '@/components/map/FleetOverviewCard';
import { mapRoutes, routeSelectorData, fleetBuses } from '@/data/mapData';

type ViewMode = 'routes' | 'fleet';

export default function RouteMap() {
  const [selectedRoute, setSelectedRoute] = useState<string>('feni-dhaka');
  const [viewMode, setViewMode] = useState<ViewMode>('routes');
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  // In fleet mode show all routes, in route mode show selected
  const visibleRoutes = viewMode === 'fleet'
    ? mapRoutes
    : mapRoutes.filter(r => r.id === selectedRoute);

  const visibleBuses = viewMode === 'fleet'
    ? fleetBuses
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col">
        {/* Mode toggle */}
        <div className="bg-card/50 border-b border-border/30 px-4 py-2">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-1 bg-secondary/50 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('routes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'routes' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                Route Explorer
              </button>
              <button
                onClick={() => setViewMode('fleet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'fleet' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                Fleet Tracking
              </button>
            </div>
            <h1 className="font-display text-sm font-bold hidden sm:block">
              {viewMode === 'routes' ? 'Route Explorer' : 'Fleet Overview'}
            </h1>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row relative">
          {/* Sidebar - desktop */}
          <div className="hidden lg:block w-80 border-r border-border/30 bg-card/30 p-4 overflow-y-auto">
            {viewMode === 'routes' ? (
              <RouteSelector
                routes={routeSelectorData}
                selectedId={selectedRoute}
                onSelect={(id) => { setSelectedRoute(id); setSelectedStop(null); }}
              />
            ) : (
              <FleetOverviewCard
                buses={fleetBuses}
                onBusSelect={setSelectedBusId}
                selectedBusId={selectedBusId}
              />
            )}
          </div>

          {/* Map */}
          <div className="flex-1 relative min-h-[400px]">
            <MapCanvas
              routes={visibleRoutes}
              activeBuses={visibleBuses}
              selectedRoute={viewMode === 'routes' ? selectedRoute : null}
              onStopClick={(stop) => setSelectedStop(stop)}
              className="w-full h-full"
            />

            {/* Stop detail */}
            {selectedStop && (
              <div className="absolute top-4 right-4 z-10">
                <StopDetailCard
                  stop={selectedStop}
                  boardingAllowed={['terminal', 'boarding', 'counter'].includes(selectedStop.type)}
                  droppingAllowed={['terminal', 'dropping'].includes(selectedStop.type)}
                  onClose={() => setSelectedStop(null)}
                />
              </div>
            )}

            {/* Route summary - when route selected */}
            {viewMode === 'routes' && selectedRoute && (
              <div className="absolute bottom-4 left-4 z-10">
                <motion.div
                  key={selectedRoute}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card px-4 py-3 flex items-center gap-4"
                >
                  {(() => {
                    const route = routeSelectorData.find(r => r.id === selectedRoute);
                    if (!route) return null;
                    return (
                      <>
                        <div>
                          <div className="font-display font-bold text-xs">{route.from} → {route.to}</div>
                          <div className="text-[10px] text-muted-foreground">{route.stops} stops · {route.distance}</div>
                        </div>
                        <div className="w-px h-8 bg-border/30" />
                        <div className="text-center">
                          <div className="text-xs font-semibold text-accent">{route.duration}</div>
                          <div className="text-[10px] text-muted-foreground">Est. travel</div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-10 hidden md:block">
              <MapLegend />
            </div>
          </div>

          {/* Mobile bottom controls */}
          <div className="lg:hidden bg-card border-t border-border/30 p-4">
            {viewMode === 'routes' ? (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {routeSelectorData.map(route => (
                  <button
                    key={route.id}
                    onClick={() => { setSelectedRoute(route.id); setSelectedStop(null); }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedRoute === route.id
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-secondary/30 border-border/20 text-muted-foreground'
                    }`}
                  >
                    {route.from} → {route.to}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                {fleetBuses.slice(0, 3).map(bus => (
                  <div key={bus.id} className="flex items-center justify-between bg-secondary/30 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-primary" />
                      <div>
                        <div className="text-xs font-semibold">{bus.label}</div>
                        <div className="text-[10px] text-muted-foreground">{bus.routeName}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      bus.status === 'on-time' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>{bus.status === 'on-time' ? 'On Time' : 'Delayed'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
