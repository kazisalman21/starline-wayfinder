import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Shield, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTripOpsStore, staffUsers } from '@/data/tripOpsData';
import starlineLogo from '@/assets/starline-logo.png';
import { toast } from 'sonner';

export default function StaffLogin() {
  const nav = useNavigate();
  const login = useTripOpsStore(s => s.login);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!identifier || password.length < 3) {
      toast.error('Enter your phone/email/badge and password');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const user = login(identifier, password);
      if (!user) {
        toast.error('Invalid credentials');
        setSubmitting(false);
        return;
      }
      toast.success(`Welcome, ${user.name}`, { description: `Signed in as ${user.role}` });
      if (user.role === 'admin') nav('/admin');
      else nav('/staff/trips');
    }, 500);
  };

  const quickLogin = (badge: string) => {
    setIdentifier(badge);
    setPassword('demo123');
    setTimeout(() => handleSubmit(), 0);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.18), transparent 70%)' }}/>
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent)/0.12), transparent 70%)' }}/>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <img src={starlineLogo} alt="Star Line" className="h-12 w-auto" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated w-full max-w-md p-7 sm:p-9"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">Staff Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Trip Operations Login</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Drivers, supervisors, and control staff. Authorized access only.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone / Email / Badge</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="01712000001"
                  className="pl-10 h-12 text-base"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 text-base"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base btn-primary-glow" disabled={submitting}>
              {submitting ? 'Signing in…' : (<>Sign in<ArrowRight className="w-4 h-4"/></>)}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick demo sign-in</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {staffUsers.filter(u => u.role !== 'admin').slice(0, 3).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => quickLogin(u.badge)}
                  className="text-left p-2.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/40 transition-colors"
                >
                  <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">{u.role}</div>
                  <div className="text-xs font-semibold text-foreground truncate mt-0.5">{u.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">{u.badge}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-[11px] text-muted-foreground mt-6 text-center max-w-md">
          By signing in you agree to operate this device per Star Line trip operations policy.
        </p>
      </div>
    </div>
  );
}
