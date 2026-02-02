import { motion } from 'framer-motion';

export default function PharmacyListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-3xl border border-border/50 overflow-hidden"
        >
          {/* Photo skeleton */}
          <div className="h-44 bg-gradient-to-br from-muted to-muted/50 animate-pulse relative">
            <div className="absolute bottom-4 left-4 w-20 h-8 bg-white/50 rounded-full" />
            <div className="absolute top-4 right-4 w-24 h-8 bg-white/30 rounded-full" />
          </div>

          {/* Content skeleton */}
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded-lg w-3/4 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-amber-100 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-10 bg-primary/20 rounded-xl animate-pulse" />
              <div className="h-10 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
