import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';
import { transitions } from '@/lib/motion-config';

interface AnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export const StaggerContainer = ({ children, className, delay = 0 }: AnimationProps) => (
    <motion.div
        initial="initial"
        animate="animate"
        variants={{
            animate: {
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: delay
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

export const FadeInUp = ({ children, className, delay = 0 }: AnimationProps) => (
    <motion.div
        variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export const SpringPress = ({ children, className, onClick }: AnimationProps & { onClick?: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={transitions.snappy as any}
        className={className}
        onClick={onClick}
    >
        {children}
    </motion.div>
);

export const LayoutTransition = ({ children, className }: AnimationProps) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
    >
        {children}
    </motion.div>
);

/**
 * Futuristic Page Transition: Hybrid slide, scale, and fade
 */
export const FuturisticPageTransition = ({ children }: { children: ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.99, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: -10, scale: 1.01, filter: 'blur(4px)' }}
        transition={transitions.page as any}
        className="h-full w-full"
    >
        {children}
    </motion.div>
);

/**
 * Magnetic Wrapper: Realistic physics-based hover effect
 */
export const MagneticWrapper = ({ children, strength = 0.2 }: { children: ReactNode, strength?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        x.set((clientX - centerX) * strength);
        y.set((clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Glow Wrapper: Cursor-reactive neon glow effect
 */
export const GlowWrapper = ({ children, color = "rgba(139, 92, 246, 0.4)" }: { children: ReactNode, color?: string }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative group overflow-hidden rounded-[inherit]"
        >
            <motion.div
                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${color}, transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
};
