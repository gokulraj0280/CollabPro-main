import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * SmartLoader: Non-spinner loading animation using pulsing hex shapes
 */
export const SmartLoader = () => (
    <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3],
                    backgroundColor: ["#8b5cf6", "#06b6d4", "#8b5cf6"]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                }}
                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            />
        ))}
    </div>
);

/**
 * SystemStatus: Minimal "Analyzing...", "Sync Complete" micro-animations
 */
export const SystemStatus = ({ status }: { status: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-tighter text-slate-400"
    >
        <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(139,92,246,0.5)]"
        />
        <span>{status}</span>
    </motion.div>
);

/**
 * DataStream: Simulate text streaming for new data arrival
 */
export const DataStream = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span className="data-stream-text">{displayedText}</span>;
};

/**
 * PulseGlow: Cursor-reactive or periodic focus glow
 */
export const PulseGlow = ({ children, active = true }: { children: React.ReactNode, active?: boolean }) => (
    <div className="relative group">
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary to-cyan-500 rounded-[inherit] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
                />
            )}
        </AnimatePresence>
        <div className="relative">
            {children}
        </div>
    </div>
);
