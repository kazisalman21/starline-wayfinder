import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapStop {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  type: 'terminal' | 'counter' | 'boarding' | 'dropping' | 'break' | 'intermediate';
  status?: 'completed' | 'current' | 'upcoming';
}

interface MapRoute {
  id: string;
  name: string;
  stops: MapStop[];
  color?: string;
}

interface BusMarker {
  id: string;
  x: number;
  y: number;
  heading: number;
  routeId: string;
  label: string;
  status: 'on-time' | 'delayed' | 'early';
}

interface MapCanvasProps {
  routes: MapRoute[];
  activeBuses?: BusMarker[];
  selectedRoute?: string | null;
  onStopClick?: (stop: MapStop) => void;
  className?: string;
  showGrid?: boolean;
}

const stopColors: Record<MapStop['type'], { fill: string; stroke: string; glow: string }> = {
  terminal: { fill: 'hsl(355, 70%, 42%)', stroke: 'hsl(355, 70%, 55%)', glow: 'hsl(355, 70%, 42%)' },
  counter: { fill: 'hsl(42, 85%, 52%)', stroke: 'hsl(42, 85%, 62%)', glow: 'hsl(42, 85%, 52%)' },
  boarding: { fill: 'hsl(152, 60%, 40%)', stroke: 'hsl(152, 60%, 55%)', glow: 'hsl(152, 60%, 40%)' },
  dropping: { fill: 'hsl(210, 75%, 52%)', stroke: 'hsl(210, 75%, 62%)', glow: 'hsl(210, 75%, 52%)' },
  break: { fill: 'hsl(42, 85%, 52%)', stroke: 'hsl(42, 80%, 60%)', glow: 'hsl(42, 85%, 52%)' },
  intermediate: { fill: 'hsl(220, 16%, 30%)', stroke: 'hsl(220, 16%, 45%)', glow: 'hsl(220, 16%, 30%)' },
};

function generateCurvePath(stops: MapStop[]): string {
  if (stops.length < 2) return '';
  let d = `M ${stops[0].x} ${stops[0].y}`;
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];
    const midX = (prev.x + curr.x) / 2;
    const cpY1 = prev.y;
    const cpY2 = curr.y;
    d += ` C ${midX} ${cpY1}, ${midX} ${cpY2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function StopMarker({ stop, isSelected, onClick }: { stop: MapStop; isSelected: boolean; onClick?: () => void }) {
  const colors = stopColors[stop.type];
  const size = stop.type === 'terminal' ? 10 : stop.type === 'intermediate' ? 5 : 7;
  const isCompleted = stop.status === 'completed';
  const isCurrent = stop.status === 'current';

  return (
    <g onClick={onClick} className="cursor-pointer" role="button">
      {/* Glow */}
      {(isCurrent || isSelected) && (
        <circle cx={stop.x} cy={stop.y} r={size + 8} fill="none" stroke={colors.glow} strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values={`${size + 6};${size + 12};${size + 6}`} dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Outer ring */}
      <circle
        cx={stop.x} cy={stop.y} r={size + 2}
        fill="hsl(220, 24%, 9%)" stroke={isCompleted ? 'hsl(152, 60%, 40%)' : colors.stroke}
        strokeWidth="1.5" opacity={isCompleted ? 0.8 : 1}
      />
      {/* Inner fill */}
      <circle
        cx={stop.x} cy={stop.y} r={size}
        fill={isCompleted ? 'hsl(152, 60%, 40%)' : colors.fill}
        opacity={stop.status === 'upcoming' ? 0.4 : 1}
      />
      {/* Checkmark for completed */}
      {isCompleted && (
        <path
          d={`M ${stop.x - 3} ${stop.y} l 2 2.5 l 4 -5`}
          fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      )}
      {/* Terminal diamond */}
      {stop.type === 'terminal' && !isCompleted && (
        <rect
          x={stop.x - 3} y={stop.y - 3} width={6} height={6}
          fill="white" opacity="0.9"
          transform={`rotate(45 ${stop.x} ${stop.y})`}
        />
      )}
      {/* Label */}
      <text
        x={stop.x} y={stop.y - size - 8}
        textAnchor="middle" fontSize="9" fontWeight="600"
        fill={isCurrent ? 'hsl(355, 70%, 55%)' : 'hsl(40, 10%, 85%)'}
        fontFamily="'Space Grotesk', sans-serif"
      >
        {stop.shortName}
      </text>
    </g>
  );
}

function BusIcon({ bus }: { bus: BusMarker }) {
  const statusColor = bus.status === 'on-time' ? 'hsl(152, 60%, 45%)' : bus.status === 'delayed' ? 'hsl(0, 84%, 60%)' : 'hsl(42, 85%, 52%)';
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: bus.x, y: bus.y }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
      {/* Pulse ring */}
      <circle cx={0} cy={0} r={18} fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.2">
        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Bus body */}
      <rect x={-12} y={-7} width={24} height={14} rx={4} fill="hsl(355, 70%, 42%)" stroke="hsl(355, 70%, 55%)" strokeWidth="1" />
      <rect x={-10} y={-5} width={8} height={5} rx={1.5} fill="hsl(210, 30%, 80%)" opacity="0.7" />
      <rect x={0} y={-5} width={8} height={5} rx={1.5} fill="hsl(210, 30%, 80%)" opacity="0.5" />
      {/* Wheels */}
      <circle cx={-7} cy={7} r={2.5} fill="hsl(220, 16%, 20%)" stroke="hsl(220, 16%, 35%)" strokeWidth="1" />
      <circle cx={7} cy={7} r={2.5} fill="hsl(220, 16%, 20%)" stroke="hsl(220, 16%, 35%)" strokeWidth="1" />
      {/* Status dot */}
      <circle cx={10} cy={-10} r={3.5} fill={statusColor} stroke="hsl(220, 24%, 9%)" strokeWidth="1.5" />
      {/* Label */}
      <text x={0} y={-16} textAnchor="middle" fontSize="8" fontWeight="600" fill="hsl(40, 10%, 92%)" fontFamily="'Space Grotesk', sans-serif">
        {bus.label}
      </text>
    </motion.g>
  );
}

export default function MapCanvas({ routes, activeBuses = [], selectedRoute, onStopClick, className = '', showGrid = false }: MapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fit to route bounds
  useEffect(() => {
    const active = routes.find(r => r.id === selectedRoute) || routes[0];
    if (!active?.stops?.length) return;
    const xs = active.stops.map(s => s.x);
    const ys = active.stops.map(s => s.y);
    const minX = Math.min(...xs) - 80;
    const maxX = Math.max(...xs) + 80;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    setViewBox({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
  }, [selectedRoute, routes]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox(v => ({
      x: v.x + v.w * (1 - factor) / 2,
      y: v.y + v.h * (1 - factor) / 2,
      w: v.w * factor,
      h: v.h * factor,
    }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;
    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;
    setViewBox(v => ({ ...v, x: v.x - dx, y: v.y - dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`} style={{ background: 'hsl(220, 28%, 5%)' }}>
      {/* Map grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(hsl(220, 16%, 30%) 1px, transparent 1px),
          linear-gradient(90deg, hsl(220, 16%, 30%) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, hsl(220, 28%, 3%) 100%)',
      }} />

      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full touch-none select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <filter id="route-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="marker-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="hsl(0,0%,0%)" floodOpacity="0.5" />
          </filter>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(355, 70%, 42%)" />
            <stop offset="100%" stopColor="hsl(42, 85%, 52%)" />
          </linearGradient>
          <linearGradient id="route-completed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(152, 60%, 40%)" />
            <stop offset="100%" stopColor="hsl(152, 60%, 50%)" />
          </linearGradient>
        </defs>

        {/* Routes */}
        {routes.map(route => {
          const isActive = route.id === selectedRoute || (!selectedRoute && routes.length === 1);
          const path = generateCurvePath(route.stops);
          // Find split point for completed/upcoming
          const currentIdx = route.stops.findIndex(s => s.status === 'current');
          const completedStops = currentIdx >= 0 ? route.stops.slice(0, currentIdx + 1) : [];
          const completedPath = completedStops.length > 1 ? generateCurvePath(completedStops) : '';

          return (
            <g key={route.id}>
              {/* Shadow line */}
              <path d={path} fill="none" stroke="hsl(0,0%,0%)" strokeWidth={isActive ? 5 : 2} opacity="0.3" strokeLinecap="round" />
              {/* Main route line */}
              <path
                d={path} fill="none"
                stroke={isActive ? 'url(#route-gradient)' : 'hsl(220, 16%, 25%)'}
                strokeWidth={isActive ? 3 : 1.5}
                strokeLinecap="round"
                strokeDasharray={isActive ? 'none' : '6 4'}
                opacity={isActive ? 1 : 0.4}
                filter={isActive ? 'url(#route-glow)' : undefined}
              />
              {/* Completed segment overlay */}
              {completedPath && isActive && (
                <path d={completedPath} fill="none" stroke="url(#route-completed)" strokeWidth={3} strokeLinecap="round" filter="url(#route-glow)" />
              )}
              {/* Stops */}
              {route.stops.map(stop => (
                <StopMarker
                  key={stop.id}
                  stop={stop}
                  isSelected={isActive}
                  onClick={() => onStopClick?.(stop)}
                />
              ))}
            </g>
          );
        })}

        {/* Bus markers */}
        {activeBuses.map(bus => (
          <BusIcon key={bus.id} bus={bus} />
        ))}
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={() => setViewBox(v => ({ x: v.x + v.w * 0.1, y: v.y + v.h * 0.1, w: v.w * 0.8, h: v.h * 0.8 }))}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-lg border border-border/40 text-foreground flex items-center justify-center text-sm font-bold hover:bg-secondary/80 transition-colors"
        >+</button>
        <button
          onClick={() => setViewBox(v => ({ x: v.x - v.w * 0.125, y: v.y - v.h * 0.125, w: v.w * 1.25, h: v.h * 1.25 }))}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-lg border border-border/40 text-foreground flex items-center justify-center text-sm font-bold hover:bg-secondary/80 transition-colors"
        >−</button>
      </div>
    </div>
  );
}

export type { MapStop, MapRoute, BusMarker };
