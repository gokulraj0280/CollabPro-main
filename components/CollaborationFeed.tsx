import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineSparkles, HiOutlineBriefcase, HiOutlineDocumentText,
    HiOutlineBuildingOffice2, HiOutlineCheckBadge,
    HiOutlineHandThumbUp, HiOutlineCpuChip, HiOutlineUserGroup,
} from 'react-icons/hi2';
import { BsActivity } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SystemStatus } from '@/components/ui/AIFeedback';

type FeedEventType = 'match' | 'project' | 'agreement' | 'partner' | 'ip' | 'challenge' | 'milestone' | 'approval';

interface FeedEvent {
    id: string;
    type: FeedEventType;
    title: string;
    description: string;
    actor: string;
    organization: string;
    timestamp: Date;
    isNew?: boolean;
}

const EVENT_CONFIG: Record<FeedEventType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    match: { icon: HiOutlineSparkles, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'New Match' },
    project: { icon: HiOutlineBriefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Project' },
    agreement: { icon: HiOutlineDocumentText, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Agreement' },
    partner: { icon: HiOutlineBuildingOffice2, color: 'text-cyan-500', bg: 'bg-cyan-500/10', label: 'Partnership' },
    ip: { icon: HiOutlineCheckBadge, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'IP Filed' },
    challenge: { icon: HiOutlineCpuChip, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Challenge' },
    milestone: { icon: HiOutlineHandThumbUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'Milestone' },
    approval: { icon: HiOutlineUserGroup, color: 'text-teal-500', bg: 'bg-teal-500/10', label: 'Approval' },
};

const SEED_EVENTS: Omit<FeedEvent, 'id' | 'timestamp' | 'isNew'>[] = [
    { type: 'match', title: 'High-Compatibility Match Found', description: 'Stanford Quantum Lab matched with Tesla R&D on "Next-Gen Battery Electrolyte Research" at 94% compatibility.', actor: 'AI Engine', organization: 'CollabSync AI' },
    { type: 'project', title: 'New Research Project Submitted', description: '"Nano-Carbon Water Filtration System" submitted by IIT Bombay. Funding requested: ₹18,00,000.', actor: 'Dr. Priya Sharma', organization: 'IIT Bombay' },
    { type: 'agreement', title: 'Collaboration Agreement Signed', description: 'MIT & NovaTech executed a 24-month collaborative agreement for "Autonomous Supply Chain AI".', actor: 'Legal Systems', organization: 'MIT × NovaTech' },
    { type: 'partner', title: 'New Industry Partner Onboarded', description: 'Reliance Industries joined the ecosystem as a Platinum corporate partner. 3 challenges posted.', actor: 'Partnership Team', organization: 'Reliance Industries' },
    { type: 'ip', title: 'IP Portfolio Updated', description: '"Biodegradable Polymer Synthesis Process" (Patent Pending) added to the University of Delhi IP portfolio.', actor: 'Prof. Arun Mehta', organization: 'University of Delhi' },
    { type: 'challenge', title: 'Industry Challenge Posted', description: 'Infosys published "Real-Time Defect Detection via Edge AI" — Budget ₹45L, Timeline: 8 months.', actor: 'R&D Division', organization: 'Infosys Ltd.' },
    { type: 'milestone', title: 'Project Milestone Achieved', description: '"Quantum Error Correction via Topological Qubits" reached Phase 2 completion — 60% funded.', actor: 'Research Team', organization: 'IISc Bangalore' },
    { type: 'approval', title: 'Multi-Signatory Approval Complete', description: 'Digital signature workflow for "Green Hydrogen Production MOU" finalized by all 4 stakeholders.', actor: 'Compliance Engine', organization: 'Various Partners' },
    { type: 'match', title: 'Expertise Cluster Detected', description: '5 academic teams with complementary ML expertise identified for "Smart Grid Optimization" challenge.', actor: 'AI Engine', organization: 'CollabSync AI' },
    { type: 'project', title: 'Research Milestone Unlocked', description: '"Solid-State Electrolyte Innovation" project progressed to TRL-4. Industry interest: 3 companies.', actor: 'Dr. Vikram Singh', organization: 'IITD Research Lab' },
];

// LIVE_EVENTS was unused and removed

function formatTimeAgo(date: Date): string {
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return 'Just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
}

function createSeeded(): FeedEvent[] {
    return SEED_EVENTS.map((ev, i) => ({
        ...ev,
        id: `seed-${i}`,
        timestamp: new Date(Date.now() - (i * 7 * 60 * 1000 + Math.random() * 5 * 60 * 1000)),
        isNew: false,
    }));
}

export function CollaborationFeed() {
    const [events, setEvents] = useState<FeedEvent[]>(createSeeded);
    const [filter, setFilter] = useState<FeedEventType | 'all'>('all');
    const [liveCount, setLiveCount] = useState(0);

    useEffect(() => {
        let channel: any;
        const isDemoMode = !import.meta.env.VITE_SUPABASE_URL;

        if (!isDemoMode) {
            import('@/lib/supabase').then(({ supabase }) => {
                channel = supabase.channel('public:notifications')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: any) => {
                        const doc = payload.new;
                        const newEvent: FeedEvent = {
                            id: `live-${doc.id}-${Math.random()}`,
                            type: (doc.type as FeedEventType) || 'match',
                            title: doc.title || 'New Ecosystem Event',
                            description: doc.description || `A new ${doc.type} event was recorded in the network.`,
                            actor: doc.actor || 'System',
                            organization: doc.organization || 'CollabSync AI',
                            timestamp: new Date(),
                            isNew: true,
                        };
                        setEvents(prev => [newEvent, ...prev].slice(0, 30));
                        setLiveCount(c => c + 1);
                    })
                    .subscribe();
            });
        }

        // --- Demo Mode Simulation ---
        let simulationInterval: any;
        if (isDemoMode) {
            simulationInterval = setInterval(() => {
                const randomSeed = SEED_EVENTS[Math.floor(Math.random() * SEED_EVENTS.length)];
                const newEvent: FeedEvent = {
                    ...randomSeed,
                    id: `sim-${Date.now()}`,
                    timestamp: new Date(),
                    isNew: true
                };
                
                setEvents(prev => [newEvent, ...prev].slice(0, 30));
                setLiveCount(c => c + 1);

                // Auto-clear notification status after 8 seconds
                setTimeout(() => {
                    setEvents(prev => prev.map(e => e.id === newEvent.id ? { ...e, isNew: false } : e));
                }, 8000);

            }, 25000 + Math.random() * 15000); // 25-40 seconds
        }

        return () => {
            if (channel) {
                import('@/lib/supabase').then(({ supabase }) => {
                    supabase.removeChannel(channel);
                });
            }
            if (simulationInterval) clearInterval(simulationInterval);
        };
    }, []);

    const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

    const counts = events.reduce<Record<string, number>>((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">Activity Feed</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-slate-500 font-medium">Live ecosystem collaboration events</p>
                        <SystemStatus status={`${liveCount} live updates`} />
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Live</span>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border',
                        filter === 'all'
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-primary/30 hover:text-primary'
                    )}
                >
                    All ({events.length})
                </button>
                {(Object.keys(EVENT_CONFIG) as FeedEventType[]).map(type => {
                    const cfg = EVENT_CONFIG[type];
                    const Icon = cfg.icon;
                    return (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5',
                                filter === type
                                    ? `${cfg.bg} ${cfg.color} border-current shadow-sm`
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            )}
                        >
                            <Icon className="h-3 w-3" />
                            {cfg.label} {counts[type] ? `(${counts[type]})` : ''}
                        </button>
                    );
                })}
            </motion.div>

            {/* Feed */}
            <div className="space-y-3">
                <AnimatePresence initial={false}>
                    {filtered.map((event) => {
                        const cfg = EVENT_CONFIG[event.type];
                        const Icon = cfg.icon;
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                layout
                            >
                                <Card className={cn(
                                    'border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-default',
                                    event.isNew
                                        ? 'border-primary/30 bg-primary/[0.02] ring-1 ring-primary/10'
                                        : 'border-slate-200 bg-white'
                                )}>
                                    {event.isNew && (
                                        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-cyan-400 to-transparent" />
                                    )}
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-white/50 group-hover:scale-110 transition-transform',
                                                cfg.bg
                                            )}>
                                                <Icon className={cn('h-5 w-5', cfg.color)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <Badge variant="outline" className={cn('text-[10px] font-black uppercase tracking-wider border-current', cfg.color, cfg.bg)}>
                                                        {cfg.label}
                                                    </Badge>
                                                    {event.isNew && (
                                                        <Badge className="bg-primary text-white text-[10px] font-black uppercase animate-pulse">
                                                            New
                                                        </Badge>
                                                    )}
                                                    <span className="ml-auto text-[11px] text-slate-400 font-medium">
                                                        {formatTimeAgo(event.timestamp)}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors mb-0.5">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed">
                                                    {event.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-[8px] text-white font-black">
                                                        {event.actor[0]}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-600">{event.actor}</span>
                                                    <span className="text-[11px] text-slate-400">·</span>
                                                    <span className="text-[11px] text-slate-400">{event.organization}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <BsActivity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-semibold">No events in this category yet</p>
                        <p className="text-sm mt-1">New events will appear automatically</p>
                    </div>
                )}
            </div>
        </div>
    );
}
