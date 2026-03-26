import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Star, Ticket, ChevronRight } from 'lucide-react';
import SearchForm from '@/components/SearchForm';

import layerBg from '@/assets/hero-layer-background.jpg';
import layerBus from '@/assets/hero-layer-bus.png';
import layerTraveler from '@/assets/hero-layer-traveler.png';

const PARALLAX_LAYERS = [
  {
    src: layerBg,
    alt: 'Night terminal scene',
    depth: 0.015,
    className: 'absolute inset-0 w-full h-full object-cover',
  },
  {
    src: layerBus,
    alt: 'Starline Bus',
    depth: 0.04,
    className: 'absolute right-[2%] bottom-[6%] h-[55%] w-auto object-contain drop-shadow-2xl',
  },
  {
    src: layerTraveler,
    alt: 'Traveler',
    depth: 0.06,
    className: 'absolute right-[28%] bottom-[4%] h-[58%] w-auto object-contain traveler-idle drop-shadow-xl',
  },
];

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 35 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(cx);
      mouseY.set(cy);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Parallax Layers */}
      {PARALLAX_LAYERS.map((layer, i) => {
        const x = useTransform(smoothX, (v) => v * layer.depth * -150);
        const y = useTransform(smoothY, (v) => v * layer.depth * -100);

        return (
          <motion.div
            key={i}
            className="absolute inset-0 will-change-transform"
            style={{ x, y, zIndex: i }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 1.6,
              delay: i * 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <img
              src={layer.src}
              alt={layer.alt}
              className={layer.className}
              draggable={false}
            />
          </motion.div>
        );
      })}

      {/* Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        <div className="lamppost-glow" />
        <div className="fog-drift" />
        <div className="headlight-bloom" />
        {/* Wet road shimmer */}
        <div className="road-shimmer" />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative pt-28 pb-16 md:pt-32 md:pb-24" style={{ zIndex: 6 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-8"
            >
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                Star Line Group
              </span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6 tracking-tight">
              Your Journey,{' '}
              <span className="text-gradient-primary">Our Pride.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-10">
              Book intercity bus tickets with Star Line — premium coaches, live tracking, and reliable schedules across Bangladesh.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all duration-300 btn-primary-glow"
              >
                <Ticket className="w-4 h-4" />
                Search Trips
              </Link>
              <Link
                to="/routes"
                className="inline-flex items-center justify-center gap-2 bg-secondary border border-border text-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all duration-300"
              >
                Explore Routes
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex items-center gap-6 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-success" /> Verified Operator
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent" /> 2M+ Passengers
              </span>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block" />
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 lg:mt-12"
        >
          <SearchForm variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
