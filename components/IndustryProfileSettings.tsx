import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineBolt,
    HiOutlinePlus,
    HiOutlineXMark,
    HiOutlineCheckBadge,
    HiOutlineScale,
    HiOutlineLockClosed,
    HiOutlineArrowUpTray
} from 'react-icons/hi2';
import { BsShieldCheck, BsGear } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

// Inline simple Switch component
const CustomSwitch = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
    <div
        onClick={() => onChange(!checked)}
        className={cn(
            "w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 border border-white/10",
            checked ? "bg-cyan-600" : "bg-white/5"
        )}
    >
        <motion.div
            animate={{ x: checked ? 20 : 2 }}
            className="absolute top-1 left-0 h-3 w-3 rounded-full bg-white shadow-sm"
        />
    </div>
);

// Inline simple Slider component (handles single value for simplicity)
const CustomSlider = ({ value, min, max, step, onChange, colorClass }: { value: number, min: number, max: number, step: number, onChange: (val: number) => void, colorClass: string }) => (
    <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={cn("w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-current", colorClass)}
    />
);

const GlassCard = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-2xl",
            className
        )}
    >
        {title && <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
            {title}
        </h4>}
        {children}
    </motion.div>
);

export const IndustryProfileSettings = () => {
    const [completeness] = useState(85);
    const [domains, setDomains] = useState(['AI', 'Materials', 'Energy', 'Robotics']);
    const [newDomain, setNewDomain] = useState('');
    const [trlMin, setTrlMin] = useState(4);
    const [trlMax, setTrlMax] = useState(7);
    const [budget, setBudget] = useState(500000);
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your industry capability profile has been synchronized with the global matchmaking engine.",
        });
    };

    const handlePreview = () => {
        toast({
            title: "Generating Preview",
            description: "Preparing your partner-facing capability document...",
        });
    };

    const addDomain = () => {
        if (newDomain && !domains.includes(newDomain)) {
            setDomains([...domains, newDomain]);
            setNewDomain('');
        }
    };

    const removeDomain = (tag: string) => {
        setDomains(domains.filter(d => d !== tag));
    };

    return (
        <div className="w-full min-h-[calc(100vh-2rem)] bg-[#020617] text-white p-6 relative overflow-hidden flex flex-col font-sans select-none rounded-3xl border border-white/5">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 bg-cyan-500" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 bg-purple-500" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Header Actions */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 mb-8 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                        Industry Profile Settings
                    </h1>
                    <p className="text-sm text-slate-400 font-medium">Configure your high-tech capability passport for global matchmaking</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 font-bold text-xs border border-white/5" onClick={handlePreview}>
                        Preview as Partner
                    </Button>
                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] border border-cyan-400/20" onClick={handleSave}>
                        Save Capability Sheet
                    </Button>
                </div>
            </motion.div>

            {/* 3-Column Grid */}
            <div className="flex-1 grid grid-cols-12 gap-6 relative z-10 overflow-hidden pb-10">

                {/* 1. Identity & Status (Left) */}
                <div className="col-span-3 flex flex-col gap-6">
                    <GlassCard className="flex flex-col items-center py-8">
                        <div className="relative mb-6">
                            <div className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-cyan-500/30 p-1 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                                <img
                                    src="https://api.dicebear.com/7.x/identicon/svg?seed=Ananya"
                                    alt="Company Logo"
                                    className="h-full w-full object-cover rounded-2xl"
                                />
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute -bottom-2 -right-2 h-10 w-10 bg-cyan-600 rounded-xl flex items-center justify-center border-2 border-[#020617] cursor-pointer shadow-lg"
                            >
                                <HiOutlineArrowUpTray className="text-white text-lg" />
                            </motion.div>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black text-white leading-tight">Ananya Rao</h2>
                            <p className="text-xs font-bold text-cyan-400 tracking-wider">Innovation Lead</p>
                            <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                                NovaTech Industries <div className="h-1 w-1 rounded-full bg-slate-700" /> Automotive
                            </div>
                        </div>

                        <div className="w-full space-y-4 mb-6 px-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                <span>Profile Integrity</span>
                                <span className="text-cyan-400">{completeness}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completeness}%` }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 px-2">
                            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 text-[9px] py-1 px-3 rounded-lg flex items-center gap-1">
                                <HiOutlineCheckBadge /> Verified Company
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 text-[9px] py-1 px-3 rounded-lg flex items-center gap-1">
                                <BsShieldCheck /> IP-Safe
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 text-[9px] py-1 px-3 rounded-lg flex items-center gap-1">
                                <HiOutlineBolt /> Priority Partner
                            </Badge>
                        </div>
                    </GlassCard>

                    <GlassCard title="Network Presence" className="flex-1">
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Active Collabs', val: '12', color: 'text-cyan-400' },
                                { label: 'Opport. Posted', val: '48', color: 'text-purple-400' },
                                { label: 'Success Rate', val: '92%', color: 'text-green-400' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center bg-white/5 rounded-xl p-3 border border-white/5 group hover:border-white/10 transition-colors">
                                    <span className={cn("text-lg font-black", stat.color)}>{stat.val}</span>
                                    <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 text-center leading-tight mt-1">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* 2. Capability & Intent (Center) */}
                <div className="col-span-6 flex flex-col gap-6">
                    <GlassCard title="Industry Capability Profile" className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">
                            {/* Domains */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Focus Domains</Label>
                                    <span className="text-[8px] italic text-slate-600">Affects match relevance score</span>
                                </div>
                                <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-white/5 bg-black/20">
                                    <AnimatePresence>
                                        {domains.map((tag) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 group cursor-default"
                                            >
                                                {tag}
                                                <HiOutlineXMark
                                                    onClick={() => removeDomain(tag)}
                                                    className="hover:text-white cursor-pointer transition-colors"
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div className="flex-1 min-w-[120px] relative">
                                        <input
                                            type="text"
                                            value={newDomain}
                                            onChange={(e) => setNewDomain(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                                            placeholder="Add tech domain..."
                                            className="w-full bg-transparent border-none focus:ring-0 text-xs text-slate-300 p-1 placeholder:text-slate-700 outline-none"
                                        />
                                        <HiOutlinePlus
                                            onClick={addDomain}
                                            className="absolute right-0 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Challenge Types */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Challenge Types</Label>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['Proof of Concept', 'Pilot Program', 'Scale-up Support', 'Joint Research Lab', 'IP Licensing'].map((type) => (
                                        <div
                                            key={type}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                        >
                                            <div className="h-4 w-4 rounded-md border-2 border-slate-700 group-hover:border-cyan-500/50 flex items-center justify-center transition-colors">
                                                {type === 'Proof of Concept' && <div className="h-2 w-2 bg-cyan-400 rounded-sm" />}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Range Controls */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">TRL Band Preference</Label>
                                    <div className="px-2 pt-2 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[8px] text-slate-500">MIN (TRL {trlMin})</span>
                                                <CustomSlider value={trlMin} min={1} max={9} step={1} onChange={setTrlMin} colorClass="text-cyan-500" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[8px] text-slate-500">MAX (TRL {trlMax})</span>
                                                <CustomSlider value={trlMax} min={trlMin} max={9} step={1} onChange={setTrlMax} colorClass="text-blue-500" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[9px] font-bold text-slate-500 px-1">
                                            <span>Basic Research</span>
                                            <span className="text-cyan-400">Production Ready</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Typical Investment Range</Label>
                                    <div className="px-2 pt-2">
                                        <CustomSlider value={budget} min={50000} max={2000000} step={50000} onChange={setBudget} colorClass="text-purple-500" />
                                        <div className="flex justify-between mt-4 text-[9px] font-bold text-slate-500 px-1">
                                            <span>$50k</span>
                                            <span className="text-purple-400">${(budget / 1000).toFixed(0)}k+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Regions & Constraints */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px) font-black text-slate-400 uppercase tracking-widest px-1">Region Reach</Label>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                                        <span className="flex items-center gap-2"><HiOutlineGlobeAlt className="text-cyan-400" /> North America, EU</span>
                                        <BsGear className="text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">IP Sensitivity</Label>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                                        <span className="flex items-center gap-2"><HiOutlineLockClosed className="text-purple-400" /> High (NDA Required)</span>
                                        <BsGear className="text-slate-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* 3. Collaboration & Governance (Right) */}
                <div className="col-span-3 flex flex-col gap-6">
                    <GlassCard title="Preference Architecture" className="space-y-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Auto-Match Signals', desc: 'Real-time engine alerts', icon: HiOutlineBolt },
                                { label: 'Stealth Identity', desc: 'Hide name from universities', icon: HiOutlineUser },
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <pref.icon className="text-cyan-400 text-lg" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold">{pref.label}</span>
                                            <span className="text-[8px] text-slate-500">{pref.desc}</span>
                                        </div>
                                    </div>
                                    <CustomSwitch checked={true} onChange={() => { }} />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Engagement Velocity</Label>
                            <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl">
                                {['Conservative', 'Balanced', 'Aggressive'].map((mode) => (
                                    <div
                                        key={mode}
                                        className={cn(
                                            "text-[8px] font-black uppercase tracking-tighter text-center py-2 rounded-lg cursor-pointer transition-all",
                                            mode === 'Balanced' ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" : "text-slate-600 hover:text-slate-400"
                                        )}
                                    >
                                        {mode}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard title="Governance & Security" className="flex-1 space-y-6">
                        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                            <BsShieldCheck className="text-3xl text-green-400 mb-2" />
                            <span className="text-[10px] font-black uppercase text-green-400">Security Posture: Strong</span>
                        </div>

                        <div className="space-y-2">
                            {[
                                { label: 'Team Access Roles', icon: HiOutlineUser },
                                { label: 'IP & NDA Templates', icon: HiOutlineScale },
                                { label: 'Compliance Details', icon: HiOutlineScale },
                            ].map((link, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white flex items-center gap-2">
                                        <link.icon className="text-slate-600 group-hover:text-cyan-400 transition-colors" /> {link.label}
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-slate-800" />
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <HiOutlineShieldCheck className="text-yellow-500" />
                                </div>
                                <p className="text-[8px] text-slate-500 leading-tight">Your data and intellectual property are encrypted and protected under CollabPro Sovereign Protocols.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>

            {/* Floating Sparkles (Micro Detail) */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse blur-[1px]" />
            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-700 blur-[1px]" />

            {/* HUD Bar */}
            <div className="mt-4 flex justify-between text-[7px] font-mono text-slate-500 tracking-tighter uppercase relative z-10 px-2 opacity-30 pb-2">
                <span>passport.v2_enterprise_active</span>
                <span>secure_token: aX4-92j-8l0</span>
                <span>encryption: quantum_resilient</span>
                <span>© 2026 CollabPro Technologies</span>
            </div>
        </div>
    );
};

export default IndustryProfileSettings;
