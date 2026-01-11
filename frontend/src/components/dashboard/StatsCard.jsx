import { cn } from '@/lib/utils';
import { SafeIcon } from '@/components/common/SafeIcon';
import { motion } from 'framer-motion';

export function StatsCard({ title, value, subtitle, icon, trend, className }) {
  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <motion.div 
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <SafeIcon icon={icon} iconClassName="h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
