import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    card: "bg-card",
    icon: "bg-secondary text-foreground",
  },
  primary: {
    card: "bg-card hover:border-primary/30",
    icon: "bg-primary/10 text-primary",
  },
  success: {
    card: "bg-card hover:border-success/30",
    icon: "bg-success/10 text-success",
  },
  warning: {
    card: "bg-card hover:border-warning/30",
    icon: "bg-warning/10 text-warning",
  },
  info: {
    card: "bg-card hover:border-info/30",
    icon: "bg-info/10 text-info",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-default group",
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span className="inline-flex items-center">
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-xl p-3 transition-transform duration-300 group-hover:scale-110",
          styles.icon
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
