import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, MapPin, Wifi, CreditCard, Headphones, ChevronRight, Star, Bus, Navigation } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { popularRoutes } from '@/data/mockData';
import heroBg from '@/assets/hero-bus.jpg';

const features = [
  { icon: Navigation, title: 'Live Tracking', desc: 'Track your coach in real-time from departure to arrival' },
  { icon: Bus, title: 'Premium Coaches', desc: 'AC Sleeper, Business & Economy classes with modern amenities' },
  { icon: MapPin, title: 'Easy Seat Selection', desc: 'Choose your preferred seat with interactive seat maps' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Pay with bKash, Nagad, card, or at counter' },
  { icon: Clock, title: 'Reliable Schedules', desc: '94% on-time performance across all routes' },
  { icon: Wifi, title: 'Onboard WiFi', desc: 'Stay connected on Platinum and Gold coaches' },
];

const trustItems = [
  { value: '94%', label: 'On-Time Rate' },
  { value: '24/7', label: 'Customer Support' },
  { value: '100%', label: 'Digital Tickets' },
  { value: '45+', label: 'Routes Covered' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">Bangladesh's Premium Bus Service</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Travel Premium.{' '}
              <span className="text-gradient-primary">Arrive Confident.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Book intercity bus tickets with Starline — premium coaches, real-time tracking, and reliable service across Bangladesh.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <SearchForm variant="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              to="/routes"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore Routes <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/live-tracking"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Live Tracking <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-card/50">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-gradient-primary">{item.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Travel with Starline?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Premium service, reliable schedules, and a world-class travel experience across Bangladesh.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Popular Routes</h2>
              <p className="text-muted-foreground">Most booked intercity routes</p>
            </div>
            <Link to="/routes" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.slice(0, 8).map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&date=2026-03-25&passengers=1`}
                  className="glass-card p-5 block card-hover group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold">{route.from}</span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{route.to}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{route.duration} • {route.distance}</span>
                    <span className="text-accent font-semibold">৳{route.basePrice}+</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Travel?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">Book your next intercity trip with Starline and experience premium travel.</p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-primary-glow"
              >
                Search Trips <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
