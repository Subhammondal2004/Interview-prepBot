import { cn } from "@/lib/utils";

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
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft animate-fade-in-scale">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-16" />
          <LoadingSkeleton className="h-3 w-20" />
        </div>
        <LoadingSkeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft animate-fade-in-scale">
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
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3 animate-fade-in-scale">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { LoadingSkeleton, StatsCardSkeleton, CategoryCardSkeleton, ActivitySkeleton };
