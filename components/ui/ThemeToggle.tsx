import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineSun } from 'react-icons/hi2';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
    const { theme, setTheme } = useAppStore();

    return (
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200 dark:border-white/10 relative overflow-hidden">
            <motion.div
                layout
                className="absolute inset-y-1 w-[48%] bg-white dark:bg-cyan-500 shadow-sm rounded-full z-0"
                initial={false}
                animate={{ x: theme === 'quantum' ? '100%' : '4%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <button
                onClick={() => setTheme('light')}
                className={cn(
                    "flex-1 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 flex items-center justify-center gap-2 transition-colors",
                    theme === 'light' ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                )}
            >
                <HiOutlineSun className="text-sm" /> Standard
            </button>

            <button
                onClick={() => setTheme('quantum')}
                className={cn(
                    "flex-1 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 flex items-center justify-center gap-2 transition-colors",
                    theme === 'quantum' ? "text-white" : "text-slate-500 hover:text-slate-400"
                )}
            >
                <HiOutlineSparkles className="text-sm" /> Quantum
            </button>
        </div>
    );
};
