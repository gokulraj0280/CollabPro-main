import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineRocketLaunch,
    HiOutlineShieldCheck,
    HiOutlineBeaker,
    HiOutlineLightBulb,
    HiOutlineCpuChip,
    HiOutlineCheckCircle
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';

interface Milestone {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'upcoming' | 'locked';
    icon: any;
    date: string;
    risk?: 'low' | 'medium' | 'high';
}

const milestones: Milestone[] = [
    {
        id: '1',
        title: 'Neural Blueprinting',
        description: 'Establishment of core project constraints and AI matching parameters.',
        status: 'completed',
        icon: HiOutlineLightBulb,
        date: 'Oct 2025',
        risk: 'low'
    },
    {
        id: '2',
        title: 'Sovereign ID Protocols',
        description: 'Biometric verification of all research nodes and secure IP vault setup.',
        status: 'completed',
        icon: HiOutlineShieldCheck,
        date: 'Nov 2025',
        risk: 'low'
    },
    {
        id: '3',
        title: 'TRL-4 Transformation',
        description: 'Validation of experimental models in simulated industrial environments.',
        status: 'in-progress',
        icon: HiOutlineBeaker,
        date: 'Feb 2026',
        risk: 'medium'
    },
    {
        id: '4',
        title: 'Quantum-Safe Integration',
        description: 'Hardening of data communication channels against post-quantum threats.',
        status: 'upcoming',
        icon: HiOutlineCpuChip,
        date: 'May 2026',
        risk: 'high'
    },
    {
        id: '5',
        title: 'Commercial Singularity',
        description: 'Full-scale industrial deployment and automated licensing maintenance.',
        status: 'locked',
        icon: HiOutlineRocketLaunch,
        date: 'Sep 2026',
        risk: 'medium'
    }
];

export const ProjectRoadmap = () => {
    const [activeMilestone, setActiveMilestone] = useState<string | null>('3');

    return (
        <div className="w-full min-h-[600px] bg-black/20 border border-white/5 rounded-3xl p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                <div>
                    <h2 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        COLLABORATION ROADMAP v2.4
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Project: Nexus-Delta Integration</p>
                </div>
                <div className="flex gap-2">
                    {['Chronos', 'Linear', 'Grid'].map((v) => (
                        <div key={v} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[8px] font-black uppercase text-slate-400">
                            {v}
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Path */}
            <div className="relative mt-24 flex items-center justify-between px-12">
                <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-gradient-to-r from-blue-500/50 via-cyan-400 to-slate-800 -translate-y-1/2" />

                {milestones.map((milestone) => {
                    const Icon = milestone.icon;
                    const isActive = activeMilestone === milestone.id;
                    const isUpcoming = milestone.status === 'upcoming' || milestone.status === 'locked';

                    return (
                        <div key={milestone.id} className="relative z-10 flex flex-col items-center">
                            {/* Milestone Node */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveMilestone(milestone.id)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                                    milestone.status === 'completed' ? "bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]" :
                                        milestone.status === 'in-progress' ? "bg-cyan-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse" :
                                            milestone.status === 'upcoming' ? "bg-slate-900 border-slate-700" : "bg-black/50 border-white/5"
                                )}
                            >
                                <Icon className={cn(
                                    "text-xl",
                                    isUpcoming ? "text-slate-500" : "text-white"
                                )} />
                                {milestone.status === 'completed' && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border border-black">
                                        <HiOutlineCheckCircle className="text-white text-[10px]" />
                                    </div>
                                )}
                            </motion.button>

                            {/* Label */}
                            <div className="absolute -bottom-12 w-32 text-center flex flex-col items-center">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest transition-colors",
                                    isActive ? "text-cyan-400" : "text-slate-500"
                                )}>
                                    {milestone.title}
                                </span>
                                <span className="text-[7px] text-slate-600 font-mono mt-0.5">{milestone.date}</span>
                            </div>

                            {/* Active Indicator Glow */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl -z-10"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Information Panel */}
            <div className="mt-32">
                <AnimatePresence mode="wait">
                    {activeMilestone && (
                        <motion.div
                            key={activeMilestone}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white">
                                            {milestones.find(m => m.id === activeMilestone)?.title}
                                        </h3>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                            milestones.find(m => m.id === activeMilestone)?.status === 'completed' ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                                                milestones.find(m => m.id === activeMilestone)?.status === 'in-progress' ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                                                    "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                                        )}>
                                            {milestones.find(m => m.id === activeMilestone)?.status}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-2 max-w-2xl leading-relaxed">
                                        {milestones.find(m => m.id === activeMilestone)?.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] text-slate-500 font-black uppercase block mb-1">Risk Assessment</span>
                                    <div className={cn(
                                        "px-3 py-1 rounded-lg border text-[10px] font-black uppercase",
                                        milestones.find(m => m.id === activeMilestone)?.risk === 'high' ? "bg-red-500/20 text-red-500 border-red-500/30" :
                                            milestones.find(m => m.id === activeMilestone)?.risk === 'medium' ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                                                "bg-green-500/20 text-green-500 border-green-500/30"
                                    )}>
                                        {milestones.find(m => m.id === activeMilestone)?.risk} Risk
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                {[
                                    { label: 'Completion Est.', val: '92%' },
                                    { label: 'Node Sync', val: 'Active' },
                                    { label: 'IP Exposure', val: 'Verified' },
                                    { label: 'Blockchain ID', val: '0x92...AE' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5">
                                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest block mb-1">{stat.label}</span>
                                        <span className="text-xs font-mono text-cyan-400">{stat.val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
