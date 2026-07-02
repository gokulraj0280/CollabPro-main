import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HiOutlineHome, HiOutlineBriefcase, HiOutlineBuildingOffice2,
  HiOutlineSparkles, HiOutlineUser, HiOutlineBell,
  HiOutlineChatBubbleBottomCenterText, HiOutlineDocumentText,
  HiOutlinePencilSquare, HiOutlineCpuChip, HiOutlineCheckBadge,
  HiOutlineMagnifyingGlass, HiOutlineXMark,
} from 'react-icons/hi2';
import { BsClockHistory, BsGraphUpArrow, BsShieldCheck, BsSearch, BsActivity } from 'react-icons/bs';
import { RiExchangeLine, RiQuillPenLine, RiDraftLine } from 'react-icons/ri';

export interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  category: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

const ALL_COMMANDS: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, category: 'Main', keywords: ['home', 'overview'] },
  { id: 'projects', label: 'Research Projects', icon: HiOutlineBriefcase, category: 'Main', keywords: ['research', 'project'] },
  { id: 'challenges', label: 'Industry Challenges', icon: HiOutlineChatBubbleBottomCenterText, category: 'Main', keywords: ['challenge', 'industry'] },
  { id: 'partners', label: 'Ecosystem', icon: HiOutlineBuildingOffice2, category: 'Main', keywords: ['partners', 'ecosystem', 'companies'] },
  { id: 'matchmaking', label: 'AI Matchmaking', icon: HiOutlineSparkles, category: 'Main', keywords: ['ai', 'match', 'compatibility'] },
  { id: 'agreement-review', label: 'Agreement Review', icon: HiOutlineDocumentText, category: 'Main', keywords: ['agreement', 'review', 'contract'] },
  { id: 'digital-signature', label: 'Digital Signature', icon: RiQuillPenLine, category: 'Main', keywords: ['sign', 'signature', 'digital'] },
  { id: 'notifications', label: 'Notifications', icon: HiOutlineBell, category: 'Main', keywords: ['notify', 'bell', 'alerts'] },
  { id: 'profile', label: 'Profile', icon: HiOutlineUser, category: 'Main', keywords: ['user', 'account', 'profile'] },
  { id: 'engine-blueprint', label: 'Engine Blueprint', icon: HiOutlineCpuChip, category: 'Main', keywords: ['engine', 'blueprint', 'cpu'] },
  { id: 'industry-profile', label: 'Industry Profile', icon: HiOutlineCheckBadge, category: 'Main', keywords: ['industry', 'settings'] },
  { id: 'feed', label: 'Activity Feed', icon: BsActivity, category: 'Main', keywords: ['feed', 'activity', 'live'] },
  { id: 'workspace', label: 'Project Workspace', icon: BsSearch, category: 'Workspace', keywords: ['workspace', 'project'] },
  { id: 'talent', label: 'Talent Showcase', icon: HiOutlineUser, category: 'Workspace', keywords: ['talent', 'people', 'team'] },
  { id: 'ip', label: 'IP Portfolio', icon: BsShieldCheck, category: 'Workspace', keywords: ['intellectual', 'property', 'ip'] },
  { id: 'negotiate', label: 'Negotiation', icon: RiExchangeLine, category: 'Workspace', keywords: ['negotiate', 'deal'] },
  { id: 'agreement', label: 'Agreement Generator', icon: RiDraftLine, category: 'Workspace', keywords: ['agreement', 'generate', 'contract'] },
  { id: 'agreement-tracking', label: 'Agreement Tracking', icon: BsClockHistory, category: 'Workspace', keywords: ['track', 'status', 'history'] },
  { id: 'ipdisclosure', label: 'Submit IP Disclosure', icon: HiOutlinePencilSquare, category: 'Workspace', keywords: ['ip', 'disclose', 'submit'] },
  { id: 'licensing', label: 'Licensing Market', icon: HiOutlineBuildingOffice2, category: 'Workspace', keywords: ['license', 'market', 'sell'] },
  { id: 'analytics', label: 'Analytics', icon: BsGraphUpArrow, category: 'Workspace', keywords: ['analytics', 'data', 'stats', 'charts'] },
];

function fuzzyMatch(query: string, item: CommandItem): boolean {
  const q = query.toLowerCase();
  if (item.label.toLowerCase().includes(q)) return true;
  if (item.category.toLowerCase().includes(q)) return true;
  if (item.keywords?.some(k => k.includes(q))) return true;
  return false;
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim() === ''
    ? ALL_COMMANDS
    : ALL_COMMANDS.filter(c => fuzzyMatch(query, c));

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[selected]) {
        onNavigate(filtered[selected].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Group by category
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 command-overlay"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search commands, pages…"
                  className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm outline-none font-medium"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700 transition-colors">
                    <HiOutlineXMark className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">ESC</kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[380px] overflow-y-auto custom-scrollbar py-2">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No results for <span className="font-semibold text-slate-600">"{query}"</span>
                  </div>
                ) : (
                  Object.entries(groups).map(([category, items]) => {
                    // find start index of this group in the flat filtered list
                    const categoryStart = filtered.findIndex(f => f === items[0]);
                    return (
                      <div key={category} className="mb-2">
                        <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {category}
                        </p>
                        {items.map((item, i) => {
                          const flatIdx = categoryStart + i;
                          const Icon = item.icon;
                          const isActive = selected === flatIdx;
                          return (
                            <button
                              key={item.id}
                              onMouseEnter={() => setSelected(flatIdx)}
                              onClick={() => { onNavigate(item.id); onClose(); }}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left',
                                isActive
                                  ? 'bg-primary/8 text-primary'
                                  : 'text-slate-700 hover:bg-slate-50'
                              )}
                            >
                              <div className={cn(
                                'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                isActive ? 'bg-primary/10' : 'bg-slate-100'
                              )}>
                                <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-slate-500')} />
                              </div>
                              <span>{item.label}</span>
                              {isActive && (
                                <kbd className="ml-auto text-[10px] font-bold text-primary border border-primary/20 rounded px-1.5 py-0.5 bg-primary/5">
                                  ↵
                                </kbd>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><kbd className="border border-slate-200 rounded px-1 bg-white">↑↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className="border border-slate-200 rounded px-1 bg-white">↵</kbd> Select</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{filtered.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
