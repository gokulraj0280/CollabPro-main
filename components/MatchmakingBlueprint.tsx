import { ReactNode, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    HiOutlineShieldCheck
} from 'react-icons/hi2';
import { GiBrain } from 'react-icons/gi';
import { BsLightningCharge, BsShieldLock } from 'react-icons/bs';

import { cn } from '@/lib/utils';

const Glow = ({ className }: { className?: string }) => (
    <div className={cn("absolute rounded-full blur-3xl opacity-20 bg-cyan-500", className)} />
);

const GlassCard = ({ children, className, title }: { children: ReactNode, className?: string, title?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md shadow-2xl",
            className
        )}
    >
        {title && <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2">{title}</h4>}
        {children}
    </motion.div>
);


export const MatchmakingBlueprint = () => {
    return (
        <div className="w-full aspect-[16/9] bg-[#020617] text-white p-6 relative overflow-hidden flex flex-col font-sans select-none">
            {/* Background Decor */}
            <Glow className="top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30" />
            <Glow className="bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/30" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* 1. Header & Context */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 mb-6 flex items-center justify-between border-b border-white/5 pb-4 bg-gradient-to-r from-white/5 to-transparent rounded-lg px-4"
            >
                <div>
                    <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                        CollabPro – Matchmaking Compatibility Engine
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">From expertise tags to commercialization-ready matches</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        <GiBrain className="text-purple-400 text-sm" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">AI Engine</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        <BsShieldLock className="text-cyan-400 text-sm" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Governance</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        <BsLightningCharge className="text-yellow-400 text-sm" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Real-Time</span>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="flex-1 grid grid-cols-12 gap-4 relative z-10 overflow-hidden">

                {/* 2. Input Signals */}
                <div className="col-span-3 flex flex-col gap-3">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1 px-1">Input Signals</h3>

                    <GlassCard title="Research Project Profile">
                        <p className="text-[9px] text-slate-300 leading-tight">expertise_areas, TRL_level, funding_range, institution_type</p>
                    </GlassCard>

                    <GlassCard title="Industry Challenge Brief">
                        <p className="text-[9px] text-slate-300 leading-tight">problem_domain, constraints, budget, urgency</p>
                    </GlassCard>

                    <GlassCard title="Historical Outcomes">
                        <p className="text-[9px] text-slate-300 leading-tight">past_match_success, project_outcome_labels, user_feedback_score</p>
                    </GlassCard>

                    <GlassCard title="Context Signals">
                        <p className="text-[9px] text-slate-300 leading-tight italic">region, regulation_level, IP_sensitivity</p>
                    </GlassCard>
                </div>

                {/* 3. Matchmaking Algorithm Pipeline */}
                <div className="col-span-6 flex flex-col justify-center items-center relative">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] absolute top-2">Matchmaking Algorithm Pipeline</h3>

                    <div className="flex items-center w-full justify-between gap-1 mt-8">
                        {[
                            { id: 1, label: "Tag Extraction", text: "Normalize & deduplicate tags", brain: false },
                            { id: 2, label: "Core Similarity", text: "Compute Jaccard similarity", brain: false },
                            { id: 3, label: "Semantic Boost", text: "Fuzzy matching skills", brain: true },
                            { id: 4, label: "TRL Weighting", text: "Weight by maturity level", brain: false },
                            { id: 5, label: "Risk Adjustor", text: "Apply compliance penalties", brain: true },
                            { id: 6, label: "Learning Loop", text: "Adjust weights via feedback", brain: true },
                        ].map((node, i) => (
                            <Fragment key={node.id}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center group relative"
                                >
                                    {node.brain && (
                                        <motion.div
                                            animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="absolute -top-6 text-purple-400"
                                        >
                                            <GiBrain size={14} />
                                        </motion.div>
                                    )}

                                    <div className="w-20 h-24 rounded-lg border border-white/20 bg-white/5 flex flex-col items-center justify-center p-2 text-center group-hover:border-cyan-500/50 transition-colors cursor-default backdrop-blur-sm shadow-lg">
                                        <span className="text-[8px] font-bold text-cyan-400 truncate w-full mb-1">{node.label}</span>
                                        <p className="text-[7px] text-slate-300 leading-[1.2]">{node.text}</p>
                                    </div>
                                </motion.div>
                                {i < 5 && (
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/50 to-cyan-500/50 relative overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-50, 50] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                                        />
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {/* Signal flow lines from left and to right */}
                    <div className="absolute left-[-20px] top-[50%] w-4 h-[1px] bg-cyan-500/30" />
                    <div className="absolute right-[-20px] top-[50%] w-4 h-[1px] bg-cyan-500/30" />
                </div>

                {/* 4. Outputs & Governance */}
                <div className="col-span-3 flex flex-col gap-3 justify-center">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1 px-1">Outputs</h3>

                    <GlassCard title="MatchScore (0–100)" className="border-l-2 border-l-cyan-500">
                        <p className="text-[9px] text-slate-300 leading-tight">Final compatibility score with TRL and risk-aware weighting.</p>
                    </GlassCard>

                    <GlassCard title="Reasoning Summary" className="border-l-2 border-l-purple-500">
                        <p className="text-[9px] text-slate-300 leading-tight">Key overlapping skills, TRL rationale, risk flags.</p>
                    </GlassCard>

                    <GlassCard title="Actionable Outcomes" className="border-l-2 border-l-yellow-500">
                        <ul className="text-[8px] text-slate-300 space-y-1 list-disc list-inside">
                            <li>Auto CollaborationRequest</li>
                            <li>Candidate Ranking</li>
                            <li className="flex items-center gap-1">
                                Risk Review <HiOutlineShieldCheck className="text-cyan-400" />
                            </li>
                        </ul>
                    </GlassCard>
                </div>
            </div>

            {/* Futuristic Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/5 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/5 rounded-bl-3xl pointer-events-none" />

            {/* HUD-like footer info */}
            <div className="mt-4 flex justify-between text-[7px] font-mono text-slate-500 tracking-tighter uppercase relative z-10 px-2 opacity-50">
                <span>sys.engine.v2.4 // active</span>
                <span>match_latency: 142ms</span>
                <span>integrity_score: 0.998</span>
                <span>© 2026 CollabPro Technologies</span>
            </div>
        </div>
    );
};

export default MatchmakingBlueprint;
