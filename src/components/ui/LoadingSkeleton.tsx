/**
 * NirogCare - Premium Loading Skeleton Components
 * Provides shimmer loading states for a polished user experience
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Base shimmer animation
const shimmerAnimation = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear' as const,
    },
};

interface SkeletonProps {
    className?: string;
}

/**
 * Base Skeleton with shimmer effect
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <motion.div
            className={cn(
                'relative overflow-hidden rounded-lg bg-muted',
                className
            )}
            style={{
                background: 'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.5) 50%, hsl(var(--muted)) 100%)',
                backgroundSize: '200% 100%',
            }}
            animate={shimmerAnimation.animate}
            transition={shimmerAnimation.transition}
        />
    );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn('h-4', i === lines - 1 ? 'w-4/5' : 'w-full')}
                />
            ))}
        </div>
    );
}

/**
 * Skeleton for cards
 */
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                'rounded-3xl border border-border bg-card p-6 space-y-4',
                className
            )}
        >
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={2} />
        </motion.div>
    );
}

/**
 * Skeleton for dashboard stat cards
 */
export function SkeletonStatCard({ className }: SkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'rounded-2xl border border-border bg-card p-4',
                className
            )}
        >
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
        </motion.div>
    );
}

/**
 * Skeleton for avatar/profile pictures
 */
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
}

/**
 * Skeleton for buttons
 */
export function SkeletonButton({ className }: SkeletonProps) {
    return <Skeleton className={cn('h-10 w-24 rounded-xl', className)} />;
}

/**
 * Skeleton for hero section
 */
export function SkeletonHero() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-8">
            <div className="text-center space-y-6 max-w-2xl">
                <Skeleton className="h-8 w-48 mx-auto rounded-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <div className="flex justify-center gap-4 mt-8">
                    <SkeletonButton className="w-32 h-14" />
                    <SkeletonButton className="w-32 h-14" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for category grid
 */
export function SkeletonCategoryGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-3xl bg-muted/50 p-6 min-h-[280px]"
                >
                    <Skeleton className="h-16 w-16 rounded-2xl mb-6" />
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-28 mt-6 rounded-full" />
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Skeleton for dashboard layout
 */
export function SkeletonDashboard() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-3">
                    <SkeletonButton />
                    <SkeletonAvatar />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="space-y-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for chat messages
 */
export function SkeletonChat() {
    return (
        <div className="space-y-4 p-4">
            {/* Bot message */}
            <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 max-w-[80%]">
                    <Skeleton className="h-20 w-64 rounded-2xl rounded-tl-none" />
                </div>
            </div>

            {/* User message */}
            <div className="flex gap-3 justify-end">
                <div className="space-y-2 max-w-[80%]">
                    <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-none" />
                </div>
            </div>

            {/* Bot message */}
            <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 max-w-[80%]">
                    <Skeleton className="h-32 w-72 rounded-2xl rounded-tl-none" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for pharmacy/store cards
 */
export function SkeletonStoreCard() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-border bg-card p-4 space-y-3"
        >
            <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <SkeletonButton className="flex-1" />
                <SkeletonButton className="flex-1" />
            </div>
        </motion.div>
    );
}

/**
 * Loading spinner with pulse animation
 */
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <motion.div
            className={cn('relative', sizeClasses[size], className)}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
        </motion.div>
    );
}

/**
 * Full page loading state
 */
export function FullPageLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-glow"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="text-3xl"
                >
                    💚
                </motion.div>
            </motion.div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground font-medium"
            >
                Loading NirogCare...
            </motion.p>
        </motion.div>
    );
}

/**
 * Pulse dots loading indicator
 */
export function PulseDots({ className }: SkeletonProps) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

export default {
    Skeleton,
    SkeletonText,
    SkeletonCard,
    SkeletonStatCard,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonHero,
    SkeletonCategoryGrid,
    SkeletonDashboard,
    SkeletonChat,
    SkeletonStoreCard,
    LoadingSpinner,
    FullPageLoader,
    PulseDots,
};
