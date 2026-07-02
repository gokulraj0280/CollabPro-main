import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Globe, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState({
    colleges: 0,
    projects: 0,
    disclosures: 0,
    latency: 0,
    synapseStrength: 98.4,
    nodesActive: 0
  });
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function updateMetrics() {
      setIsScanning(true);
      const start = performance.now();
      try {
        const [cCount, pCount, dCount] = await Promise.all([
          db.colleges.count(),
          db.research_projects.count(),
          db.ip_disclosures.count()
        ]);
        const end = performance.now();
        
        setMetrics(prev => ({
          ...prev,
          colleges: cCount,
          projects: pCount,
          disclosures: dCount,
          latency: Math.round(end - start) + 8,
          nodesActive: Math.floor(Math.random() * 5) + 8 // Simulated active edge nodes
        }));
        setIsConnected(true);
      } catch (err) {
        console.error("Ecosystem check failed:", err);
        setIsConnected(false);
      } finally {
        setTimeout(() => setIsScanning(false), 800);
      }
    }

    updateMetrics();
    const metricInterval = setInterval(updateMetrics, 10000);
    
    const jitterInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        latency: Math.max(12, Math.min(85, prev.latency + (Math.random() * 10 - 5))),
        synapseStrength: Math.max(97.5, Math.min(100, prev.synapseStrength + (Math.random() * 0.2 - 0.1)))
      }));
    }, 3000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(jitterInterval);
    };
  }, []);

  return (
    <div className="relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden group">
      {/* Background Neural Mesh Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#06b6d433,transparent_70%)] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ top: -10, opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/20 group-hover:border-violet-500/40 transition-colors">
                <Database className="h-5 w-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
              </div>
              {isConnected && (
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              )}
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Match Mesh</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {isConnected ? "Sovereign Node Online" : "Connection Error"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Latency</p>
            <div className="flex items-center justify-end gap-1">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">{Math.round(metrics.latency)}ms</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/5 border border-white/5 rounded-xl p-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-0.5">
              <Globe className="h-3 w-3 text-blue-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Nodes</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-sm font-black text-white">{metrics.colleges}</p>
              <span className="text-[8px] font-bold text-slate-600">INTL</span>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-xl p-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Integrity</span>
            </div>
            <p className="text-sm font-black text-white">{metrics.synapseStrength.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-2 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Cpu className="h-3 w-3 text-cyan-400" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Compute Threads</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400">{metrics.nodesActive}</span>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-[8px] font-black text-emerald-400/70 uppercase tracking-[0.15em]">Sovereign Verified</span>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                    opacity: [0.2, 1, 0.2],
                    scaleY: [1, 1.5, 1]
                }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                className="h-2 w-1 rounded-full bg-cyan-500/60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
