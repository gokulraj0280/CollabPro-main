
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// --- Animated Counter ---
export function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

// --- Hover Tilt Card ---
export function HoverCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("relative transition-all duration-200 ease-out", className)}
        >
            {children}
        </motion.div>
    );
}

// --- Shiny Button ---
export function ShinyButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "relative overflow-hidden px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg group",
                className
            )}
        >
            <span className="relative z-10">{children}</span>
            <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
            />
        </motion.button>
    );
}

// --- Floating Particles Background ---
export function ParticleBackground() {
    // Generate random positions for particles
    const particles = [...Array(20)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
    }));

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-white/10 rounded-full blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, -50, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" style={{ animationDelay: '4s' }} />
        </div>
    );
}
