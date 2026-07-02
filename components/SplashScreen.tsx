import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineBuildingOffice2, HiOutlineUser, HiOutlineArrowRight } from 'react-icons/hi2';
import { BsStars } from 'react-icons/bs';
import { cn } from '@/lib/utils';

type Role = 'college' | 'corporate' | 'student';

interface SplashScreenProps {
    onLaunch: (role: Role) => void;
}

const ROLES: { id: Role; label: string; subtitle: string; icon: React.ElementType; gradient: string; glow: string }[] = [
    {
        id: 'college',
        label: 'Academic',
        subtitle: 'Universities & Research Labs',
        icon: HiOutlineAcademicCap,
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/30',
    },
    {
        id: 'corporate',
        label: 'Industry',
        subtitle: 'Companies & R&D Divisions',
        icon: HiOutlineBuildingOffice2,
        gradient: 'from-violet-500 to-purple-700',
        glow: 'shadow-purple-500/30',
    },
    {
        id: 'student',
        label: 'Talent',
        subtitle: 'Students & Researchers',
        icon: HiOutlineUser,
        gradient: 'from-cyan-500 to-blue-500',
        glow: 'shadow-cyan-500/30',
    },
];

export function SplashScreen({ onLaunch }: SplashScreenProps) {
    const [launching, setLaunching] = useState(false);

    const handleLaunch = (role: Role) => {
        setLaunching(true);
        // Swift, purposeful "boot" to minimize UX friction
        setTimeout(() => {
            onLaunch(role);
        }, 1200);
    };

    return (
        <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020308] text-white overflow-hidden pointer-events-auto"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-800/20 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
            
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 ring-1 ring-white/10 relative group">
                            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                                src="https://image2url.com/r2/default/images/1771329385661-8f28ce43-1650-4db7-b0d6-8fe239ee1acc.png"
                                alt="CollabSync Pro"
                                className="h-12 w-12 object-cover rounded-xl relative z-10"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                            <BsStars className="text-cyan-400 text-lg" />
                        </motion.div>
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-cyan-400">CollabSync Pro</span>
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                            <BsStars className="text-cyan-400 text-lg" />
                        </motion.div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
                        Sovereign Intelligence
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
                            Ecosystem
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base font-medium max-w-lg mx-auto leading-relaxed border-l-2 border-violet-500/30 pl-6 text-left italic">
                        Bridging institutional research and industrial implementation with verified neural matchmaking and decentralized protocols.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!launching ? (
                        <motion.div
                            key="role-selector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                                {ROLES.map(role => {
                                    const Icon = role.icon;
                                    return (
                                        <motion.div
                                            key={role.id}
                                            whileHover={{ y: -5 }}
                                            className={cn(
                                                'relative flex flex-col items-center gap-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 group overflow-hidden'
                                            )}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            
                                            <div className={cn(
                                                'h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110',
                                                `bg-gradient-to-br ${role.gradient}`,
                                                role.glow
                                            )}>
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>

                                            <div className="text-center relative z-10">
                                                <p className="font-black text-white text-lg tracking-tight">{role.label}</p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug px-2">
                                                    {role.subtitle}
                                                </p>
                                            </div>

                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLaunch(role.id);
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    "mt-4 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer",
                                                    `bg-gradient-to-r ${role.gradient} text-white shadow-lg`
                                                )}
                                            >
                                                Explore Path
                                                <HiOutlineArrowRight className="h-4 w-4" />
                                            </motion.button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="boot-sequence"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col items-center gap-8 py-10"
                        >
                            <div className="relative h-32 w-32">
                                <svg className="h-full w-full rotate-[-90deg]">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="60"
                                        fill="transparent"
                                        stroke="#1e293b"
                                        strokeWidth="4"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="60"
                                        fill="transparent"
                                        stroke="url(#bootGradient)"
                                        strokeWidth="4"
                                        strokeDasharray="377"
                                        initial={{ strokeDashoffset: 377 }}
                                        animate={{ strokeDashoffset: 0 }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="bootGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div 
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 flex items-center justify-center border border-white/10"
                                    >
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-xs font-black text-cyan-400"
                                        >
                                            READY
                                        </motion.span>
                                    </motion.div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-cyan-400 font-mono text-sm tracking-wider uppercase font-black"
                                >
                                    Establishing Secure Neural Mesh...
                                </motion.p>
                                <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-[10px] text-slate-700 font-mono tracking-widest"
                >
                    v1.1.0 · LOCAL DEMO MODE · MIT LICENSE
                </motion.div>
            </div>
        </motion.div>
    );
}
