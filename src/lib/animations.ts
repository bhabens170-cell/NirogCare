/**
 * NirogCare - Centralized Animation System
 * Premium, reusable animation variants and presets for Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITION PRESETS
// ============================================

export const springTransition: Transition = {
    type: 'spring',
    stiffness: 150,
    damping: 20,
};

export const smoothTransition: Transition = {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier for smooth motion
    duration: 0.5,
};

export const bounceTransition: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 20,
};

export const slowTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.8,
};

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeIn' }
    }
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springTransition
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springTransition
    }
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: springTransition
    }
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: springTransition
    }
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: bounceTransition
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

export const slideInFromBottom: Variants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
        opacity: 1,
        y: 0,
        transition: { ...springTransition, duration: 0.6 }
    },
    exit: {
        opacity: 0,
        y: '100%',
        transition: { duration: 0.4 }
    }
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

export const staggerContainerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25
        }
    }
};

export const floatingCard: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 15
        }
    }
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonVariants: Variants = {
    idle: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: bounceTransition
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
    }
};

export const pulsingButton: Variants = {
    idle: { scale: 1, boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
    pulse: {
        scale: [1, 1.02, 1],
        boxShadow: [
            '0 0 0 0 rgba(34, 197, 94, 0.4)',
            '0 0 0 15px rgba(34, 197, 94, 0)',
            '0 0 0 0 rgba(34, 197, 94, 0)'
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// ============================================
// ICON ANIMATIONS
// ============================================

export const iconBounce: Variants = {
    idle: { y: 0, rotate: 0 },
    hover: {
        y: -3,
        rotate: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.5 }
    }
};

export const iconPulse: Variants = {
    idle: { scale: 1 },
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const iconSpin: Variants = {
    idle: { rotate: 0 },
    animate: {
        rotate: 360,
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

export const iconFloat: Variants = {
    idle: { y: 0 },
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

export const pageSlide: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.3 }
    }
};

// ============================================
// MODAL & OVERLAY ANIMATIONS
// ============================================

export const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2, delay: 0.1 }
    }
};

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.2 }
    }
};

export const drawerVariants: Variants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        x: '100%',
        transition: { duration: 0.3 }
    }
};

// ============================================
// SKELETON & LOADING ANIMATIONS
// ============================================

export const shimmer: Variants = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

export const loadingDots: Variants = {
    animate: {
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1, 0.8],
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const breathe: Variants = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// ============================================
// NOTIFICATION & TOAST ANIMATIONS
// ============================================

export const toastSlideIn: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: bounceTransition
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

export const notificationBadge: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 20
        }
    }
};

// ============================================
// HEALTH-SPECIFIC ANIMATIONS
// ============================================

export const heartbeat: Variants = {
    animate: {
        scale: [1, 1.15, 1, 1.1, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut'
        }
    }
};

export const pulseRing: Variants = {
    animate: {
        scale: [1, 2, 2.5],
        opacity: [0.6, 0.3, 0],
        transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut'
        }
    }
};

export const healthGlow: Variants = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(34, 197, 94, 0.3)',
            '0 0 40px rgba(34, 197, 94, 0.5)',
            '0 0 20px rgba(34, 197, 94, 0.3)'
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const progressFill: Variants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: (progress: number) => ({
        scaleX: progress / 100,
        transition: {
            duration: 1,
            ease: 'easeOut',
            delay: 0.3
        }
    })
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a staggered delay for children elements
 */
export const staggerDelay = (index: number, baseDelay: number = 0.1) => ({
    transition: { delay: index * baseDelay }
});

/**
 * Creates a viewport-based animation trigger
 */
export const viewportOnce = {
    once: true,
    margin: '-50px',
    amount: 0.3
};

/**
 * Combines multiple variants
 */
export const combineVariants = (...variants: Variants[]): Variants => {
    return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
};

/**
 * Creates custom spring with adjustable parameters
 */
export const customSpring = (stiffness: number, damping: number): Transition => ({
    type: 'spring',
    stiffness,
    damping
});

/**
 * Creates a delayed variant based on index
 */
export const delayedVariant = (baseVariant: Variants, index: number): Variants => ({
    ...baseVariant,
    visible: {
        ...(baseVariant.visible as object),
        transition: {
            ...(baseVariant.visible as { transition?: Transition }).transition,
            delay: index * 0.1
        }
    }
});
