import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Smartphone, Building2, ChevronRight, Lock, Clock, Headphones, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const paymentMethods = [
  { id: 'bkash', name: 'bKash', desc: 'Pay with bKash mobile wallet', icon: Smartphone, color: 'text-pink-400' },
  { id: 'nagad', name: 'Nagad', desc: 'Pay with Nagad mobile wallet', icon: Smartphone, color: 'text-orange-400' },
  { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, DBBL', icon: CreditCard, color: 'text-blue-400' },
  { id: 'counter', name: 'Pay at Counter', desc: 'Reserve now, pay at boarding', icon: Building2, color: 'text-muted-foreground' },
];

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') || 'Feni';
  const to = params.get('to') || 'Dhaka';
  const date = params.get('date') || '2026-04-08';
  const seats = params.get('seats')?.split(',') || ['A1'];
  const fare = Number(params.get('fare') || 850);
  const coachName = params.get('coachName') || 'Starline Platinum';
  const coachType = params.get('coachType') || 'AC';
  const dep = params.get('dep') || '22:00';
  const arr = params.get('arr') || '02:00';
  const boarding = params.get('boarding') || 'Mohipal Main Counter';
  const dropping = params.get('dropping') || 'Maniknagar Terminal';
  const name = params.get('name') || 'Rahim Uddin';
  const phone = params.get('phone') || '+8801712345678';
  const email = params.get('email') || 'rahim@email.com';

  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [agreed, setAgreed] = useState(false);

  // Reservation timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);
  const timerMins = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;
  const timerExpired = timeLeft === 0;

  const serviceFee = Math.round(fare * 0.03);
  const total = fare + serviceFee;

  const confirmBooking = () => {
    if (timerExpired) return;
    const bookingId = `STR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    navigate(`/ticket?bookingId=${bookingId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&seats=${seats.join(',')}&fare=${total}&coachName=${encodeURIComponent(coachName)}&dep=${dep}&arr=${arr}&boarding=${encodeURIComponent(boarding)}&dropping=${encodeURIComponent(dropping)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&payment=${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container max-w-4xl">
          <h1 className="font-display text-2xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-muted-foreground text-sm mb-4">Complete your booking for {from} → {to}</p>

          {/* Reservation Timer */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              timerExpired
                ? 'bg-destructive/10 border border-destructive/20'
                : timeLeft < 120
                ? 'bg-warning/10 border border-warning/20'
                : 'bg-primary/5 border border-primary/15'
            }`}
          >
            <Clock className={`w-5 h-5 ${timerExpired ? 'text-destructive' : timeLeft < 120 ? 'text-warning' : 'text-primary'}`} />
            <div className="flex-1">
              {timerExpired ? (
                <p className="text-sm font-medium text-destructive">Your reservation has expired. Please search again.</p>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    Seats reserved for <span className="font-bold text-accent">{timerMins}:{String(timerSecs).padStart(2, '0')}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Complete payment to confirm your booking</p>
                </>
              )}
            </div>
            {timerExpired && (
              <Link to="/search" className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors">
                Search Again
              </Link>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Payment Methods */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      disabled={timerExpired}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === pm.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary/50 hover:border-border/80'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <pm.icon className={`w-6 h-6 ${pm.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{pm.name}</div>
                        <div className="text-xs text-muted-foreground">{pm.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-primary' : 'border-border'}`}>
                        {paymentMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-3">Cancellation Policy</h3>
                <ul className="text-sm text-muted-foreground space-y-1.5 mb-4 list-disc list-inside">
                  <li>Free cancellation up to 6 hours before departure</li>
                  <li>50% refund between 6–2 hours before departure</li>
                  <li>No refund within 2 hours of departure</li>
                </ul>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-muted-foreground">I agree to the terms and cancellation policy</span>
                </label>
              </div>

              {/* Help info */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Need help with payment?</p>
                    <p className="text-xs text-muted-foreground">Call 16XXX or chat with Star Line Care for instant support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="glass-card-accent p-6 sticky top-24">
                <h3 className="font-display font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Passenger</span><span>{name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span>{from} → {to}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{date}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{dep} – {arr}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Coach</span><span>{coachName} ({coachType})</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span>{seats.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Boarding</span><span className="text-right text-xs max-w-[140px]">{boarding}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dropping</span><span className="text-right text-xs max-w-[140px]">{dropping}</span></div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Ticket fare</span><span>৳{fare}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Service fee</span><span>৳{serviceFee}</span></div>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span><span className="text-accent">৳{total}</span>
                  </div>
                </div>

                <button
                  onClick={confirmBooking}
                  disabled={!agreed || timerExpired}
                  className="w-full mt-6 bg-primary text-primary-foreground rounded-lg py-3 font-semibold text-sm hover:bg-primary/90 transition-colors btn-primary-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {timerExpired ? 'Reservation Expired' : `Confirm & Pay ৳${total}`}
                </button>

                {/* What happens next */}
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">After payment:</p>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>E-ticket sent to your phone & email</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>QR code for boarding — no printout needed</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>Free cancellation up to 6 hours before</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span>Secured by SSL encryption</span>
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
