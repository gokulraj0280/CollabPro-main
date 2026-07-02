/**
 * Standardized easing curves for the futuristic AI UI.
 * These curves are designed to feel techy, responsive, and premium.
 */
export const transitions = {
    // Rapid, responsive transition for small UI elements
    snappy: {
        type: "spring",
        stiffness: 400,
        damping: 30
    },

    // Smooth, elegant transition for cards and containers
    elegant: {
        type: "spring",
        stiffness: 300,
        damping: 25
    },

    // Custom cubic-bezier for AI-agent-style motion (slight acceleration)
    agent: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
    },

    // Hybrid transition for page entry (fade + slide + scale)
    page: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
    }
};

export const motionVariants = {
    fadeInUp: {
        initial: { opacity: 0, y: 15, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.98 }
    },

    glowPulse: {
        animate: {
            boxShadow: [
                "0 0 0px rgba(139, 92, 246, 0.1)",
                "0 0 15px rgba(139, 92, 246, 0.3)",
                "0 0 0px rgba(139, 92, 246, 0.1)"
            ]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};
