/**
 * NirogCare - Micro Interaction Components
 * Small, delightful animations that enhance user experience
 */

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useRef, ReactNode } from 'react';
import { Check, X, Star, Heart, ThumbsUp, Sparkles, Zap, Trophy } from 'lucide-react';

/**
 * Magnetic hover effect - element follows cursor
 */
interface MagneticProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export function Magnetic({ children, className = '', strength = 0.3 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}

/**
 * Ripple effect on click
 */
interface RippleProps {
    children: ReactNode;
    className?: string;
    color?: string;
}

export function Ripple({ children, className = '', color = 'rgba(255,255,255,0.3)' }: RippleProps) {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 800);
    };

    return (
        <div className={`relative overflow-hidden ${className}`} onClick={addRipple}>
            {children}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            backgroundColor: color,
                        }}
                        initial={{ width: 0, height: 0, transform: 'translate(-50%, -50%)' }}
                        animate={{ width: 400, height: 400, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

/**
 * Success checkmark animation
 */
export function SuccessCheck({ show, size = 60 }: { show: boolean; size?: number }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                    style={{ width: size, height: size }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <Check className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
                    </motion.div>
                    {/* Particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-emerald-400"
                            initial={{ scale: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                                y: Math.sin((i * 60 * Math.PI) / 180) * 40,
                            }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Error X animation
 */
export function ErrorX({ show, size = 60 }: { show: boolean; size?: number }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring' }}
                    className="rounded-full bg-destructive flex items-center justify-center shadow-lg"
                    style={{ width: size, height: size }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <X className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Like/Heart animation with particles
 */
export function LikeHeart({
    isLiked,
    onToggle,
    size = 32
}: {
    isLiked: boolean;
    onToggle: () => void;
    size?: number;
}) {
    const [particles, setParticles] = useState<number[]>([]);

    const handleClick = () => {
        if (!isLiked) {
            setParticles([...Array(8)].map((_, i) => i));
            setTimeout(() => setParticles([]), 700);
        }
        onToggle();
    };

    return (
        <button onClick={handleClick} className="relative focus:outline-none">
            <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    style={{ width: size, height: size }}
                    className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`}
                />
            </motion.div>

            {/* Particles */}
            <AnimatePresence>
                {particles.map((i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-red-400"
                        style={{ left: '50%', top: '50%' }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            x: Math.cos((i * 45 * Math.PI) / 180) * 25,
                            y: Math.sin((i * 45 * Math.PI) / 180) * 25,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                ))}
            </AnimatePresence>
        </button>
    );
}

/**
 * Star rating with animation
 */
export function StarRating({
    rating,
    maxRating = 5,
    onRate,
    size = 24,
}: {
    rating: number;
    maxRating?: number;
    onRate?: (rating: number) => void;
    size?: number;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="flex gap-1">
            {[...Array(maxRating)].map((_, i) => {
                const isFilled = i < (hovered !== null ? hovered : rating);
                return (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHovered(i + 1)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onRate?.(i + 1)}
                        className="focus:outline-none"
                    >
                        <motion.div
                            animate={isFilled ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <Star
                                style={{ width: size, height: size }}
                                className={`transition-colors ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                                    }`}
                            />
                        </motion.div>
                    </motion.button>
                );
            })}
        </div>
    );
}

/**
 * Confetti burst animation
 */
export function ConfettiBurst({ trigger }: { trigger: boolean }) {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

    return (
        <AnimatePresence>
            {trigger && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3"
                            style={{
                                left: '50%',
                                top: '50%',
                                backgroundColor: colors[i % colors.length],
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1, 1, 0],
                                x: (Math.random() - 0.5) * 400,
                                y: (Math.random() - 0.5) * 400 + 200,
                                rotate: Math.random() * 720,
                            }}
                            transition={{
                                duration: 1.5,
                                ease: 'easeOut',
                                delay: Math.random() * 0.2,
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

/**
 * Achievement unlock animation
 */
export function AchievementUnlock({
    show,
    title,
    description,
    icon = '🏆',
    onClose,
}: {
    show: boolean;
    title: string;
    description: string;
    icon?: string;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl p-1 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-card rounded-[22px] p-8 text-center min-w-[280px]">
                            {/* Sparkles decoration */}
                            <motion.div
                                className="absolute top-4 right-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                            </motion.div>

                            {/* Icon */}
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                            >
                                {icon}
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="font-bold text-xl text-foreground mb-2"
                            >
                                {title}
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-muted-foreground text-sm mb-4"
                            >
                                {description}
                            </motion.p>

                            {/* Stars decoration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-center gap-1"
                            >
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                                    >
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Tap feedback wrapper - scales on tap
 */
export function TapFeedback({
    children,
    className = '',
    scale = 0.97
}: {
    children: ReactNode;
    className?: string;
    scale?: number;
}) {
    return (
        <motion.div
            className={className}
            whileTap={{ scale }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Hover glow effect
 */
export function HoverGlow({
    children,
    className = '',
    glowColor = 'rgba(34, 197, 94, 0.4)',
}: {
    children: ReactNode;
    className?: string;
    glowColor?: string;
}) {
    return (
        <motion.div
            className={`relative ${className}`}
            whileHover="hover"
        >
            <motion.div
                className="absolute inset-0 rounded-xl blur-xl -z-10"
                style={{ backgroundColor: glowColor }}
                variants={{
                    hover: { opacity: 1, scale: 1.1 },
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            />
            {children}
        </motion.div>
    );
}

export default {
    Magnetic,
    Ripple,
    SuccessCheck,
    ErrorX,
    LikeHeart,
    StarRating,
    ConfettiBurst,
    AchievementUnlock,
    TapFeedback,
    HoverGlow,
};
