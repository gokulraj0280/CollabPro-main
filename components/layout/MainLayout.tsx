import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    HiOutlineHome,
    HiOutlineBriefcase,
    HiOutlineBuildingOffice2,
    HiOutlineSparkles,
    HiOutlineUser,
    HiOutlineBell,
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineDocumentText,
    HiOutlinePencilSquare,
    HiOutlineCpuChip,
    HiOutlineCheckBadge,
    HiOutlineCommandLine,
} from 'react-icons/hi2';
import { BsClockHistory, BsGraphUpArrow, BsShieldCheck, BsSearch, BsActivity } from 'react-icons/bs';
import { RiExchangeLine, RiQuillPenLine, RiDraftLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { ParticleBackground } from '@/components/ui/animated-primitives';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { getRoleLabel, getInitials } from '@/lib/userUtils';
import { useAppStore } from '@/lib/store';
import { useNotifications } from '@/hooks/useDatabase';
import DecryptedText from '@/components/ui/DecryptedText';
import { FuturisticPageTransition } from '@/components/ui/animation-wrapper';
import { SystemStatus } from '@/components/ui/AIFeedback';
import { SplashScreen } from '@/components/SplashScreen';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    { id: '/', label: 'Dashboard', icon: HiOutlineHome },
    { id: '/projects', label: 'Research Projects', icon: HiOutlineBriefcase },
    {
        id: '/challenges',
        label: 'Industry Challenges',
        icon: HiOutlineChatBubbleBottomCenterText,
    },
    { id: '/partners', label: 'Ecosystem', icon: HiOutlineBuildingOffice2 },
    { id: '/matchmaking', label: 'AI Matchmaking', icon: HiOutlineSparkles },
    {
        id: '/agreement-review',
        label: 'Agreement Review',
        icon: HiOutlineDocumentText,
    },
    { id: '/digital-signature', label: 'Digital Signature', icon: RiQuillPenLine },
    {
        id: '/notifications',
        label: 'Notifications',
        icon: HiOutlineBell,
        needsBadge: true,
    },
    { id: '/feed', label: 'Activity Feed', icon: BsActivity },
    { id: '/profile', label: 'Profile', icon: HiOutlineUser },
    { id: '/engine-blueprint', label: 'Engine Blueprint', icon: HiOutlineCpuChip },
    { id: '/industry-profile', label: 'Industry Profile', icon: HiOutlineCheckBadge },
];

const secondaryItems = [
    { id: '/workspace', label: 'Project Workspace', icon: BsSearch },
    { id: '/talent', label: 'Talent Showcase', icon: HiOutlineUser },
    { id: '/ip', label: 'IP Portfolio', icon: BsShieldCheck },
    { id: '/negotiate', label: 'Negotiation', icon: RiExchangeLine },
    { id: '/agreement', label: 'Agreement', icon: RiDraftLine },
    { id: '/agreement-tracking', label: 'Agreement Tracking', icon: BsClockHistory },
    { id: '/ipdisclosure', label: 'Submit IP', icon: HiOutlinePencilSquare },
    { id: '/licensing', label: 'Licensing Market', icon: HiOutlineBuildingOffice2 },
    { id: '/analytics', label: 'Analytics', icon: BsGraphUpArrow },
];

function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <span className="font-mono text-[11px] font-bold tabular-nums text-slate-500">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
}

export function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeSection = location.pathname;

    const [commandOpen, setCommandOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(() => {
        // Show on every session to ensure the user sees the 'wow' animation as requested
        return sessionStorage.getItem('collabpro_sessionSplashSeen') !== '1';
    });
    const { unreadCount } = useNotifications();

    const { loadUser, user: storeUser, updateUser, theme, setUserFromAuth } = useAppStore();

    useEffect(() => {
        import('@/lib/supabase').then(({ supabase }) => {
            supabase.auth.getSession().then(({ data: { session } }: any) => {
                if (session?.user) {
                    setUserFromAuth(session.user);
                } else {
                    // Fallback to demo mode for unauthenticated users in this prototype
                    loadUser('user_1');
                }
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
                if (session?.user) {
                    setUserFromAuth(session.user);
                }
            });

            return () => subscription.unsubscribe();
        });
    }, [setUserFromAuth, loadUser]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSplashLaunch = useCallback(async (role: 'college' | 'corporate' | 'student') => {
        // Immediate state update
        await updateUser({ organization_type: role });
        sessionStorage.setItem('collabpro_sessionSplashSeen', '1');
        setShowSplash(false);
    }, [updateUser]);

    const userRole = storeUser?.organization_type;
    const isStudent = userRole === 'student';
    const isAcademic = isStudent || userRole === 'college';

    const filteredNavItems = navItems.filter(item => {
        if (userRole === 'college') {
            return !['/challenges', '/matchmaking', '/agreement-review', '/digital-signature', '/industry-profile', '/licensing', '/analytics', '/talent'].includes(item.id);
        }
        if (userRole === 'student') {
            return ['/', '/talent', '/notifications', '/feed', '/profile'].includes(item.id);
        }
        if (userRole === 'corporate') {
            return !['/talent'].includes(item.id); // Industry can see almost everything except pure talent showcase if isolated, though usually they want it.
        }
        return true;
    });

    const filteredSecondaryItems = secondaryItems.filter(item => {
        if (userRole === 'college') {
            return !['/licensing', '/analytics', '/negotiate', '/agreement'].includes(item.id);
        }
        if (userRole === 'student') {
            return false; // Students have minimal secondary workspace items in this layout
        }
        if (userRole === 'corporate') {
            return !['/ipdisclosure'].includes(item.id);
        }
        return true;
    });

    const mainMenuTitle = isAcademic ? 'Academy Menu' : 'Company Menu';
    const workspaceTitle = isAcademic ? 'Academy Workspace' : 'Company Workspace';

    // Determine title for header
    const allItems = [...navItems, ...secondaryItems];
    const activeItem = allItems.find(i => i.id === activeSection || activeSection.startsWith(i.id + '/')) || { label: 'CollabSync Pro' };

    return (
        <>
            <AnimatePresence>
                {showSplash && <SplashScreen onLaunch={handleSplashLaunch} />}
            </AnimatePresence>

            <CommandPalette
                open={commandOpen}
                onClose={() => setCommandOpen(false)}
                onNavigate={(s) => {
                    const target = s === 'dashboard' ? '/' : `/${s}`;
                    navigate(target);
                }}
            />

            <div className={cn(
                "flex h-screen overflow-hidden selection:bg-primary/10 transition-colors duration-500",
                theme === 'quantum' ? "bg-[#020617] text-white" : "bg-[#F8FAFC] text-slate-900"
            )}>
                <ParticleBackground />

                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "w-64 z-10 relative flex flex-col border-r transition-colors duration-500 flex-shrink-0",
                        theme === 'quantum' ? "bg-black/40 border-white/10" : "border-slate-200 glass-panel"
                    )}
                >
                    <div className={cn("p-6 border-b transition-colors duration-500", theme === 'quantum' ? "border-white/10" : "border-slate-200")}>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-200/50">
                                <img
                                    src="https://image2url.com/r2/default/images/1771329385661-8f28ce43-1650-4db7-b0d6-8fe239ee1acc.png"
                                    alt="CollabSync Pro Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className={cn("text-xl font-bold leading-tight transition-colors", theme === 'quantum' ? "text-white" : "text-slate-900")}>
                                    <DecryptedText text="CollabSync Pro" />
                                </h1>
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase py-0.5 px-2 bg-primary/10 rounded-full inline-block mt-1">
                                    Pro
                                </span>
                            </div>
                        </div>
                        <div className="px-0 py-3 flex flex-col gap-2">
                            <DatabaseStatus />
                            <SystemStatus status="System Ready" />
                            <div className="mt-2">
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={() => setCommandOpen(true)}
                                className={cn(
                                    'mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200',
                                    theme === 'quantum'
                                        ? 'border-white/10 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5'
                                        : 'border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 bg-white/50'
                                )}
                            >
                                <HiOutlineCommandLine className="h-3.5 w-3.5" />
                                <span>Search commands</span>
                                <kbd className={cn(
                                    'ml-auto text-[9px] font-black border rounded px-1 tracking-wide',
                                    theme === 'quantum' ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400'
                                )}>
                                    Ctrl+K
                                </kbd>
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            <p className={cn("text-xs font-semibold px-3 mb-2 uppercase tracking-wider transition-colors", theme === 'quantum' ? "text-slate-500" : "text-gray-500")}>
                                {mainMenuTitle}
                            </p>
                            {filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(item.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative overflow-hidden mb-1',
                                            isActive
                                                ? (theme === 'quantum' ? 'text-cyan-400 bg-cyan-500/10' : 'text-primary bg-primary/5')
                                                : (theme === 'quantum' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'),
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <Icon
                                            className={cn(
                                                'h-4 w-4 relative z-10 transition-transform group-hover:scale-110',
                                                isActive ? 'text-primary' : 'text-gray-500 group-hover:text-slate-900',
                                            )}
                                        />
                                        <span className="relative z-10">{item.label}</span>
                                        {item.needsBadge && unreadCount > 0 && (
                                            <Badge className="ml-auto bg-primary text-white border-0 shadow-sm relative z-10">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">
                                {workspaceTitle}
                            </p>
                            {filteredSecondaryItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id || activeSection.startsWith(item.id + '/');
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            // For workspace, we default to 1 if no param is given for now, or just /workspace.
                                            if (item.id === '/workspace' && activeSection !== '/workspace') {
                                                navigate('/workspace/1');
                                            } else {
                                                navigate(item.id);
                                            }
                                        }}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative mb-1',
                                            isActive
                                                ? 'text-slate-900 bg-slate-100'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-4 w-4 transition-transform group-hover:scale-110',
                                                isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900',
                                            )}
                                        />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-300 group"
                        >
                            <div className="h-10 w-10 bg-gradient-to-tr from-primary to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-primary/10 ring-2 ring-white group-hover:ring-primary/20 transition-all font-mono">
                                {getInitials(storeUser?.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                    {storeUser?.organization || 'Personal Profile'}
                                </p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                    {getRoleLabel(storeUser)}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
                    <div className={cn(
                        'flex items-center justify-between px-6 py-3 border-b flex-shrink-0 transition-colors duration-500',
                        theme === 'quantum'
                            ? 'bg-black/30 border-white/5 backdrop-blur-xl'
                            : 'bg-white/80 border-slate-200 backdrop-blur-md'
                    )}>
                        <div className="flex items-center gap-2">
                            <span className={cn('text-[11px] font-black uppercase tracking-widest', theme === 'quantum' ? 'text-slate-600' : 'text-slate-400')}>
                                CollabSync Pro
                            </span>
                            <span className={cn('text-[11px]', theme === 'quantum' ? 'text-slate-700' : 'text-slate-300')}>/</span>
                            <span className={cn('text-[11px] font-black uppercase tracking-widest', theme === 'quantum' ? 'text-cyan-400' : 'text-primary')}>
                                {activeItem.label}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <LiveClock />
                            <button
                                onClick={() => setCommandOpen(true)}
                                className={cn(
                                    'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-200',
                                    theme === 'quantum'
                                        ? 'border-white/10 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/20 bg-white/3'
                                        : 'border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 bg-white'
                                )}
                            >
                                <HiOutlineCommandLine className="h-3.5 w-3.5" />
                                <span>Search</span>
                                <kbd className="border border-current rounded px-1 text-[9px] opacity-60">⌘K</kbd>
                            </button>

                            <button
                                onClick={() => navigate('/notifications')}
                                className={cn(
                                    'relative p-2 rounded-lg transition-colors',
                                    theme === 'quantum' ? 'hover:bg-white/5 text-slate-500 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                )}
                            >
                                <HiOutlineBell className="h-4 w-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary shadow-md shadow-primary/50" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar p-6">
                        <AnimatePresence mode="wait">
                            <FuturisticPageTransition key={activeSection}>
                                <div className="h-full max-w-7xl mx-auto">
                                    <Outlet />
                                </div>
                            </FuturisticPageTransition>
                        </AnimatePresence>
                    </div>

                    <div className={cn(
                        'flex items-center justify-between px-6 py-2 border-t flex-shrink-0 footer-glow transition-colors duration-500',
                        theme === 'quantum'
                            ? 'bg-black/40 border-white/5'
                            : 'bg-white/70 border-slate-200 backdrop-blur-sm'
                    )}>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                />
                                <span className={cn('text-[10px] font-black uppercase tracking-widest', theme === 'quantum' ? 'text-slate-600' : 'text-slate-400')}>
                                    System Online
                                </span>
                            </div>
                            <span className={cn('text-[10px] font-mono', theme === 'quantum' ? 'text-slate-700' : 'text-slate-300')}>
                                v1.1.0 · Local Demo
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn('text-[10px] font-black uppercase tracking-widest', theme === 'quantum' ? 'text-slate-600' : 'text-slate-400')}>
                                {getRoleLabel(storeUser)}
                            </span>
                            <span className={cn('text-[10px] font-mono', theme === 'quantum' ? 'text-slate-700' : 'text-slate-300')}>
                                {storeUser?.organization || 'CollabSync Pro'}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
