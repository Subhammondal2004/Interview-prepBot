import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function LoadingSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent animate-shimmer" />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-16" />
          <LoadingSkeleton className="h-3 w-20" />
        </div>
        <LoadingSkeleton className="h-12 w-12 rounded-lg" />
      </div>
    </motion.div>
  );
}

function CategoryCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <LoadingSkeleton className="h-12 w-12 rounded-lg" />
        <LoadingSkeleton className="h-5 w-5 rounded" />
      </div>
      <div className="mt-4 space-y-2">
        <LoadingSkeleton className="h-5 w-28" />
        <LoadingSkeleton className="h-4 w-20" />
      </div>
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-10" />
        </div>
        <LoadingSkeleton className="h-1.5 w-full rounded-full" />
      </div>
    </motion.div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
        >
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <LoadingSkeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-5 w-12" />
        </div>
        <div className="space-y-1">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-5 w-12" />
        </div>
        <div className="space-y-1">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-5 w-12" />
        </div>
      </div>
    </motion.div>
  );
}

function QuestionCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex items-start justify-between mb-3">
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
        <LoadingSkeleton className="h-5 w-5 rounded" />
      </div>
      <LoadingSkeleton className="h-5 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center gap-2">
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
      </div>
    </motion.div>
  );
}

function AnalyticsChartSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft"
    >
      <LoadingSkeleton className="h-6 w-40 mb-6" />
      <div className="flex items-end gap-2 h-48">
        {[40, 65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 55].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex-1 rounded-t-md bg-muted relative overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent animate-shimmer" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TableRowSkeleton() {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <td className="p-4"><LoadingSkeleton className="h-4 w-24" /></td>
      <td className="p-4"><LoadingSkeleton className="h-4 w-16" /></td>
      <td className="p-4"><LoadingSkeleton className="h-4 w-20" /></td>
      <td className="p-4"><LoadingSkeleton className="h-2 w-full rounded-full" /></td>
    </motion.tr>
  );
}

// Full page loading overlay with animated dots
function LoadingOverlay({ message = "Loading..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-lg"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
}

// Inline loading spinner with pulse effect
function LoadingSpinner({ size = "md", className }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      className={cn("relative", sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-muted" />
      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent" />
    </motion.div>
  );
}

// Pulsing loading card for content areas
function LoadingCard({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 rounded-xl border border-border bg-card",
        className
      )}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary/20 to-primary/40"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-sm text-muted-foreground"
      >
        Loading content...
      </motion.p>
    </motion.div>
  );
}

// Page-specific loading states
function HistoryPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-10 w-32 rounded-lg" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}

function QuestionBankPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-10 w-28 rounded-lg" />
          <LoadingSkeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <QuestionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChartSkeleton />
        <AnalyticsChartSkeleton />
      </div>
    </div>
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { 
  LoadingSkeleton, 
  StatsCardSkeleton, 
  CategoryCardSkeleton, 
  ActivitySkeleton,
  SessionCardSkeleton,
  QuestionCardSkeleton,
  AnalyticsChartSkeleton,
  TableRowSkeleton,
  LoadingOverlay,
  LoadingSpinner,
  LoadingCard,
  HistoryPageSkeleton,
  QuestionBankPageSkeleton,
  AnalyticsPageSkeleton,
  DashboardPageSkeleton
};
