import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineCpuChip,
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineArrowTrendingUp,
    HiOutlineCube,
    HiOutlineQueueList
} from 'react-icons/hi2';
import { BsActivity } from 'react-icons/bs';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateQuantumReadiness, generateLivePulseData, QuantumMetrics } from '@/lib/intelligence/quantum-readiness';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const HudCard = ({ children, title, icon: Icon, className }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
            "relative bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden backdrop-blur-xl group",
            className
        )}
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Icon className="text-cyan-400 text-sm" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-cyan-400 transition-colors">
                {title}
            </h3>
            <div className="ml-auto flex gap-1">
                <div className="w-1 h-1 bg-cyan-500/40 rounded-full" />
                <div className="w-1 h-1 bg-cyan-500/20 rounded-full" />
            </div>
        </div>
        {children}
    </motion.div>
);

export const QuantumDashboard = () => {
    const { testData, livePulse, addPulse } = useAppStore();
    const { chartData } = testData;
    const [metrics, setMetrics] = useState<QuantumMetrics>(calculateQuantumReadiness({ team_size: 8, funding_allocated: 250000 }));
    const { toast } = useToast();

    const handleAnalyze = () => {
        toast({
            title: "Deep Target Analysis Initiated",
            description: "Executing recursive strategic evaluation of all connected research nodes...",
        });
    };

    // Simulate pulse messages and metric updates
    useEffect(() => {
        const interval = setInterval(() => {
            const pulse = generateLivePulseData();
            addPulse(pulse as any);

            // Randomly oscillate metrics slightly
            setMetrics(prev => ({
                ...prev,
                cryptoAgility: Math.max(0, Math.min(100, prev.cryptoAgility + (Math.random() * 4 - 2))),
                innovationVelocity: Math.max(0, Math.min(10, prev.innovationVelocity + (Math.random() * 0.4 - 0.2))),
                readinessScore: Math.max(0, Math.min(100, prev.readinessScore + (Math.random() * 2 - 1)))
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [addPulse]);

    return (
        <div className="w-full min-h-screen bg-[#020617] text-white p-6 flex flex-col gap-6 font-sans relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* HUD Header */}
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-500">
                            INNOVATION HUD
                        </h1>
                        <div className="px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-black uppercase tracking-widest text-cyan-400 animate-pulse">
                            System Active
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sovereign Entity ID: PX-902-DELTA</p>
                </div>

                <div className="flex gap-4">
                    {[
                        { label: 'Latency', val: '4ms', color: 'text-green-400' },
                        { label: 'Uptime', val: '99.98%', color: 'text-cyan-400' },
                        { label: 'AI Load', val: '12%', color: 'text-purple-400' },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-end">
                            <span className="text-[7px] text-slate-600 font-black tracking-widest uppercase">{s.label}</span>
                            <span className={cn("text-xs font-black", s.color)}>{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main HUD Grid */}
            <div className="grid grid-cols-12 gap-6 flex-1 relative z-10">

                {/* Left: Project metrics and Active Nodes */}
                <div className="col-span-3 flex flex-col gap-6">
                    <HudCard title="Engine Metrics" icon={HiOutlineCpuChip}>
                        <div className="space-y-4">
                            {[
                                { label: 'Crypto-Agility', val: Math.round(metrics.cryptoAgility) },
                                { label: 'Quantum Readiness', val: Math.round(metrics.readinessScore) },
                                { label: 'Resource Resilience', val: Math.round(metrics.resourceResilience) }
                            ].map((m, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-black tracking-widest text-slate-500 uppercase">
                                        <span>{m.label}</span>
                                        <span className="text-cyan-400">{m.val}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.val}%` }}
                                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HudCard>

                    <HudCard title="Active Nodes" icon={HiOutlineCube} className="flex-1">
                        <div className="flex flex-col gap-3 py-2">
                            {[
                                { name: 'Stanford Quantum Lab', status: 'connected', load: 'HIGH' },
                                { name: 'Tesla R&D Hub', status: 'idle', load: 'MED' },
                                { name: 'MIT Bio-Engine', status: 'connected', load: 'LOW' },
                                { name: 'NovaTech HQ', status: 'syncing', load: 'MIN' },
                            ].map((node, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        node.status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_green]' :
                                            node.status === 'syncing' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-600'
                                    )} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-white truncate">{node.name}</span>
                                        <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Load: {node.load}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HudCard>
                </div>

                {/* Center: Live Pulse and Analytics */}
                <div className="col-span-6 flex flex-col gap-6">
                    <HudCard title="System Innovation Pulse" icon={BsActivity} className="flex-1">
                        <div className="h-[40%] mb-4 border-b border-white/5 pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#22d3ee"
                                        fill="url(#pulseGradient)"
                                        strokeWidth={2}
                                    />
                                    <defs>
                                        <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #22d3ee', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            <AnimatePresence initial={false}>
                                {livePulse.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-cyan-950/20 border-l-2 border-cyan-500/50"
                                    >
                                        <div className={cn(
                                            "p-1 rounded bg-white/5",
                                            p.type === 'match' ? 'text-green-400' :
                                                p.type === 'alert' ? 'text-amber-400' : 'text-cyan-400'
                                        )}>
                                            {p.type === 'match' ? <HiOutlineBolt size={12} /> : <HiOutlineQueueList size={12} />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-[10px] font-medium text-slate-200 leading-tight">{p.message}</p>
                                            <span className="text-[7px] text-slate-500 uppercase font-mono mt-1">{p.timestamp}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </HudCard>
                </div>

                {/* Right: Security and Targets */}
                <div className="col-span-3 flex flex-col gap-6">
                    <HudCard title="Security Protocol" icon={HiOutlineShieldCheck}>
                        <div className="flex flex-col items-center py-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                            <HiOutlineShieldCheck className="text-4xl text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Vault Secured</span>
                            <span className="text-[8px] text-slate-500 mt-1">AES-256 Quantum Resistant</span>
                        </div>
                        <div className="mt-4 space-y-2">
                            {['IP Masking', 'Geo-Fencing', 'Sovereign ID Auth', 'Hybrid PQC Tunnel'].map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span>{s}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Active QKD Stream</span>
                                <span className="text-[7px] text-green-400 font-mono">INTEGRITY_SAFE</span>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(24)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: [0.2, 1, 0.2],
                                            height: [4, 8, 4]
                                        }}
                                        transition={{
                                            duration: 1 + Math.random(),
                                            repeat: Infinity,
                                            delay: i * 0.05
                                        }}
                                        className="flex-1 bg-cyan-500/40 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </HudCard>

                    <HudCard title="Strategic Targets" icon={HiOutlineArrowTrendingUp} className="flex-1">
                        <div className="space-y-4">
                            {[
                                { label: 'Entanglement Factor', val: metrics.entanglementFactor.toFixed(2), trend: '+0.04' },
                                { label: 'Innovation Velocity', val: metrics.innovationVelocity.toFixed(1), trend: '+0.8' },
                                { label: 'Readiness Index', val: Math.round(metrics.readinessScore), trend: '+1.2' },
                            ].map((t, i) => (
                                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">{t.label}</span>
                                        <span className="text-[8px] font-black text-green-400">{t.trend}</span>
                                    </div>
                                    <div className="text-lg font-black mt-1">{t.val}</div>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/20"
                        >
                            Analyze Deep Targets
                        </motion.button>
                    </HudCard>
                </div>

            </div>

            {/* Floating Indicators */}
            <div className="absolute bottom-6 right-6 flex gap-3 text-[7px] font-mono text-slate-700 uppercase tracking-tighter opacity-50 z-10 pointer-events-none">
                <span>sys_clock: {new Date().toLocaleTimeString()}</span>
                <span>kernel_v: 0.9.8-stable</span>
                <span>auth_type: biometric_handshake</span>
            </div>
        </div>
    );
};

export default QuantumDashboard;
