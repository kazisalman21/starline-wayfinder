import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Phone, Mail, MessageCircle, Headphones, AlertTriangle,
  ChevronDown, HelpCircle, MapPin, CreditCard, RefreshCw, ArrowLeftRight,
  Ticket, Bot, Shield, Clock, ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supportFaqs, supportCategories } from '@/data/supportData';

const iconMap: Record<string, typeof Ticket> = {
  Ticket, MapPin, CreditCard, RefreshCw, ArrowLeftRight, Search: Search,
  AlertTriangle, Headphones,
};

export default function Support() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (key: string) => {
    const next = new Set(openItems);
    next.has(key) ? next.delete(key) : next.add(key);
    setOpenItems(next);
  };

  const filteredFaqs = supportFaqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top, hsl(355 70% 42% / 0.08) 0%, transparent 60%)' }} />
          <div className="container max-w-4xl relative py-16 md:py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
                <Bot className="w-3.5 h-3.5" />
                AI-Powered Support • Available 24/7
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                How can we <span className="text-gradient-primary">help you</span> today?
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8">
                Get instant answers, track your issues, or connect with our support team
              </p>
              <div className="max-w-lg mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help topics, routes, bookings..."
                  className="pl-12 h-13 text-base bg-card/80 border-border/40 rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl pb-16 space-y-16">

        {/* AI Support CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card-elevated p-8 md:p-10 text-center border-glow">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(355 70% 42%), hsl(355 75% 34%))' }}>
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Star Line AI Care</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Get instant help with bookings, refunds, routes, complaints, and more — powered by AI
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Track booking', 'Refund status', 'File complaint', 'Route info', 'Counter hours'].map((chip) => (
              <span key={chip} className="px-3 py-1.5 rounded-full text-xs border border-border/40 text-muted-foreground">
                {chip}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Click the <strong className="text-primary">Star Line Care</strong> button at the bottom right to start chatting
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div>
          <h2 className="font-display text-xl font-bold mb-6 text-center">Direct Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Phone, label: '24/7 Hotline', value: '16XXX', desc: 'Always available', color: 'text-primary' },
              { icon: Mail, label: 'Email Support', value: 'support@starline.com.bd', desc: 'Reply within 2 hours', color: 'text-accent' },
              { icon: MessageCircle, label: 'Live Chat', value: 'Start Chat', desc: 'Available 8AM - 12AM', color: 'text-green-400' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card p-6 text-center card-hover">
                <c.icon className={`w-7 h-7 ${c.color} mx-auto mb-3`} />
                <div className="font-display font-semibold text-sm mb-1">{c.label}</div>
                <div className="text-xs text-accent font-medium">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Categories Grid */}
        <div>
          <h2 className="font-display text-xl font-bold mb-6 text-center">Support Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {supportCategories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || HelpCircle;
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
                  className="glass-card p-4 card-hover cursor-pointer group text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-medium text-xs mb-1">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground">{cat.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Complaint CTA */}
        <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display font-bold text-lg mb-1">Have a Complaint?</h3>
            <p className="text-sm text-muted-foreground">Submit a complaint and track it in real-time. Our team resolves issues within 24 hours.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/my-complaints">
              <Button variant="outline" size="sm">My Complaints</Button>
            </Link>
            <Button size="sm" className="btn-primary-glow">Submit Complaint</Button>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {filteredFaqs.map((section, si) => (
              <div key={si}>
                <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, qi) => {
                    const key = `${si}-${qi}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div key={qi} className="glass-card overflow-hidden">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                        >
                          <span className="text-sm font-medium pr-4">{item.q}</span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div className="glass-card p-6 border-l-4 border-l-red-500/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Shield className="w-8 h-8 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-display font-bold text-sm mb-1">Emergency & Safety</h3>
            <p className="text-xs text-muted-foreground">For emergencies during your trip, call our 24/7 emergency hotline <strong className="text-foreground">16XXX</strong> or contact the nearest counter. Our control room is always monitoring.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
