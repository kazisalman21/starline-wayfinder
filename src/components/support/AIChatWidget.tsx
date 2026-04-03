import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Paperclip, Mic, Headphones, ChevronDown,
  Bot, User, Clock, CheckCheck, AlertTriangle, Copy, Download, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  complaintCategories, starlineRoutes, starlineCounters,
  useSupportStore, type ComplaintCategory,
} from '@/data/supportData';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  time: string;
  type?: 'text' | 'chips' | 'complaint-step' | 'success';
  chips?: string[];
  complaintStep?: string;
}

const suggestionChips = [
  'Track my issue', 'Booking help', 'Refund / cancel', 'Payment problem',
  'Bus delayed', 'Counter information', 'Talk to support', 'Submit complaint',
];

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [complaintFlow, setComplaintFlow] = useState<Record<string, string>>({});
  const [complaintStep, setComplaintStep] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addComplaint = useSupportStore((s) => s.addComplaint);

  const complaintSteps = [
    { key: 'name', label: 'Your Full Name', type: 'text', placeholder: 'e.g. Rahim Uddin' },
    { key: 'phone', label: 'Phone Number', type: 'text', placeholder: 'e.g. 01712345678' },
    { key: 'route', label: 'Route', type: 'select', options: starlineRoutes },
    { key: 'travelDate', label: 'Travel Date', type: 'date' },
    { key: 'counter', label: 'Boarding Counter', type: 'select', options: starlineCounters },
    { key: 'category', label: 'Issue Category', type: 'chips', options: complaintCategories },
    { key: 'details', label: 'Complaint Details', type: 'textarea', placeholder: 'Describe your issue in detail...' },
    { key: 'urgency', label: 'Urgency Level', type: 'chips', options: ['Low', 'Medium', 'High', 'Critical'] },
    { key: 'confirm', label: 'Confirm Submission', type: 'confirm' },
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '0', role: 'ai', content: 'Assalamu Alaikum! 👋 Welcome to **Star Line Care**. I\'m your AI support assistant. How can I help you today?',
          time: now(), type: 'text',
        },
        {
          id: '1', role: 'ai', content: '', time: now(), type: 'chips', chips: suggestionChips,
        },
      ]);
    }
  }, [isOpen]);

  const addMsg = (msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: String(Date.now() + Math.random()) }]);
  };

  const simulateAI = (text: string, extra?: Partial<Message>) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMsg({ role: 'ai', content: text, time: now(), type: 'text', ...extra });
    }, 800 + Math.random() * 600);
  };

  const handleChipClick = (chip: string) => {
    addMsg({ role: 'user', content: chip, time: now() });
    if (chip === 'Submit complaint') {
      setComplaintStep(0);
      simulateAI('I\'ll help you file a complaint. Let me collect some details step by step.\n\n**Step 1 of 9**: What is your full name?');
    } else if (chip === 'Talk to support') {
      simulateAI('Connecting you to a human agent... 🔄\n\nOur support team is available **8AM - 12AM**. You can also call our 24/7 hotline at **16XXX** or email **support@starline.com.bd**.');
    } else if (chip === 'Track my issue') {
      simulateAI('Please provide your complaint ID (e.g. STC-2048) and I\'ll check the status for you.');
    } else {
      simulateAI(`I'd be happy to help with **${chip.toLowerCase()}**! Could you provide more details about your issue?`);
    }
  };

  const handleComplaintInput = (value: string) => {
    const step = complaintSteps[complaintStep];
    if (!step) return;
    const updated = { ...complaintFlow, [step.key]: value };
    setComplaintFlow(updated);
    addMsg({ role: 'user', content: value, time: now() });

    if (step.key === 'confirm') {
      // Submit complaint
      const cid = `STC-${2050 + Math.floor(Math.random() * 100)}`;
      const complaint = {
        id: String(Date.now()),
        complaintId: cid,
        customerName: updated.name || '',
        phone: updated.phone || '',
        email: '',
        route: updated.route || '',
        travelDate: updated.travelDate || '',
        boardingCounter: updated.counter || '',
        category: (updated.category || 'Other') as ComplaintCategory,
        priority: updated.urgency === 'Critical' ? 'Critical' as const : updated.urgency === 'High' ? 'High' as const : updated.urgency === 'Medium' ? 'Medium' as const : 'Low' as const,
        details: updated.details || '',
        urgency: updated.urgency || 'Medium',
        status: 'Submitted' as const,
        assignedStaff: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiSummary: `Customer ${updated.name} reported ${updated.category} on ${updated.route} route.`,
        internalNotes: '',
        timeline: [{
          id: 't1', status: 'Submitted' as const,
          note: 'Complaint submitted via AI Chat', by: 'System', at: new Date().toISOString(),
        }],
      };
      addComplaint(complaint);
      setComplaintStep(-1);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMsg({
          id: String(Date.now()), role: 'ai', time: now(), type: 'success',
          content: `✅ **Complaint Submitted Successfully!**\n\n🆔 **Complaint ID:** ${cid}\n👤 **Name:** ${updated.name}\n🚌 **Route:** ${updated.route}\n📋 **Category:** ${updated.category}\n⚡ **Priority:** ${updated.urgency}\n\nOur support team will review your complaint within **2 hours**. You can track it anytime using your complaint ID.\n\nIs there anything else I can help with?`,
        });
      }, 1200);
      return;
    }

    const nextIdx = complaintStep + 1;
    if (nextIdx < complaintSteps.length) {
      setComplaintStep(nextIdx);
      const next = complaintSteps[nextIdx];
      if (next.key === 'confirm') {
        simulateAI(`📋 **Review Your Complaint**\n\n👤 **Name:** ${updated.name}\n📱 **Phone:** ${updated.phone}\n🚌 **Route:** ${updated.route}\n📅 **Date:** ${updated.travelDate}\n📍 **Counter:** ${updated.counter}\n📋 **Category:** ${updated.category}\n💬 **Details:** ${updated.details}\n⚡ **Urgency:** ${updated.urgency}\n\nPlease type **"Confirm"** to submit or **"Edit"** to make changes.`);
      } else {
        simulateAI(`**Step ${nextIdx + 1} of 9**: ${next.label}${next.type === 'chips' ? '\n\nSelect one:' : ''}`);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');

    if (complaintStep >= 0) {
      handleComplaintInput(text);
      return;
    }

    addMsg({ role: 'user', content: text, time: now() });

    const lower = text.toLowerCase();
    if (lower.includes('complaint') || lower.includes('complain') || lower.includes('report')) {
      setComplaintStep(0);
      simulateAI('I\'ll help you file a complaint. Let me collect some details.\n\n**Step 1 of 9**: What is your full name?');
    } else if (lower.includes('refund') || lower.includes('cancel')) {
      simulateAI('For **refunds and cancellations**:\n\n• Free cancellation up to **6 hours** before departure\n• 50% refund between **6-2 hours**\n• No refund within **2 hours**\n\nbKash/Nagad refunds take **1-2 business days**. Card refunds take **5-7 days**.\n\nWould you like to cancel a booking or check a refund status?');
    } else if (lower.includes('track') || lower.includes('stc-')) {
      simulateAI('Please provide your complaint ID (e.g. **STC-2048**) and I\'ll look up the status for you.');
    } else if (lower.includes('counter') || lower.includes('terminal')) {
      simulateAI('Star Line operates terminals at:\n\n📍 **Abdullahpur** • **Maniknagar** • **Feni Terminal** • **Boropol (CTG)** • **Sea Hill (Cox\'s Bazar)** • **Lakshmipur**\n\nPlus 30+ counters across routes. Visit our [Counters page](/counters) for full details and phone numbers.');
    } else {
      simulateAI('Thank you for your message! I understand you need help. Could you tell me more about your issue? You can also select from the quick options below.', { type: 'chips', chips: suggestionChips });
    }
  };

  const currentStep = complaintStep >= 0 ? complaintSteps[complaintStep] : null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-primary-foreground font-medium text-sm shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(355 70% 42%), hsl(355 75% 34%))',
              boxShadow: '0 0 30px hsl(355 70% 42% / 0.4), 0 8px 32px hsl(0 0% 0% / 0.5)',
            }}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="hidden sm:inline">Star Line Care</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[680px] sm:max-h-[85vh] flex flex-col rounded-none sm:rounded-2xl overflow-hidden border border-border/30"
            style={{
              background: 'linear-gradient(180deg, hsl(220 28% 7%) 0%, hsl(220 24% 5%) 100%)',
              boxShadow: '0 0 60px hsl(0 0% 0% / 0.6), 0 0 30px hsl(355 70% 42% / 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30"
              style={{ background: 'linear-gradient(135deg, hsl(220 24% 9%) 0%, hsl(220 28% 7%) 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(355 70% 42%), hsl(355 75% 34%))' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground">Star Line Care</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-green-400">Online now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Headphones className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                      style={{ background: 'hsl(355 70% 42% / 0.15)' }}>
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                    {msg.type === 'chips' && msg.chips ? (
                      <div className="flex flex-wrap gap-2">
                        {msg.chips.map((chip) => (
                          <button key={chip} onClick={() => handleChipClick(chip)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/50 text-foreground/80 hover:bg-primary/15 hover:border-primary/40 hover:text-primary transition-all">
                            {chip}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : msg.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-foreground rounded-bl-md'
                            : 'bg-card/80 border border-border/30 text-foreground rounded-bl-md'
                      }`}>
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>
                            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                              part.startsWith('**') && part.endsWith('**')
                                ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                                : part
                            )}
                            {i < msg.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      <Clock className="w-3 h-3 text-muted-foreground/50" />
                      <span className="text-[10px] text-muted-foreground/50">{msg.time}</span>
                      {msg.role === 'user' && <CheckCheck className="w-3 h-3 text-primary/60" />}
                    </div>
                    {msg.type === 'success' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="w-3 h-3" /> Copy ID
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center ml-2 mt-1 flex-shrink-0 bg-secondary/60">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'hsl(355 70% 42% / 0.15)' }}>
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-card/80 border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Complaint Step Input */}
              {currentStep && currentStep.type === 'chips' && currentStep.options && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {currentStep.options.map((opt) => (
                    <button key={opt} onClick={() => handleComplaintInput(opt)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/50 text-foreground/80 hover:bg-primary/15 hover:border-primary/40 hover:text-primary transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentStep && currentStep.type === 'select' && currentStep.options && (
                <div className="pl-9 max-h-40 overflow-y-auto space-y-1 scrollbar-hide">
                  {currentStep.options.map((opt) => (
                    <button key={opt} onClick={() => handleComplaintInput(opt)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-foreground/80 hover:bg-primary/15 hover:text-primary transition-all border border-transparent hover:border-primary/30">
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Complaint Progress */}
            {complaintStep >= 0 && complaintStep < complaintSteps.length && (
              <div className="px-4 py-2 border-t border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3 h-3 text-accent" />
                  <span className="text-[10px] text-accent font-medium">Filing Complaint</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{complaintStep + 1}/{complaintSteps.length}</span>
                </div>
                <div className="w-full bg-secondary/40 rounded-full h-1">
                  <div className="bg-accent h-1 rounded-full transition-all" style={{ width: `${((complaintStep + 1) / complaintSteps.length) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-border/30" style={{ background: 'hsl(220 24% 7%)' }}>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={currentStep?.type === 'date' ? 'YYYY-MM-DD' : currentStep?.placeholder || 'Type a message...'}
                    className="bg-secondary/40 border-border/30 rounded-xl pr-10 text-sm placeholder:text-muted-foreground/50"
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="icon" className="h-9 w-9 flex-shrink-0 rounded-xl" onClick={handleSend}
                  style={{ background: 'linear-gradient(135deg, hsl(355 70% 42%), hsl(355 75% 34%))' }}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
