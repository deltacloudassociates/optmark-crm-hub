import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "left" | "pending" | "completed" | "overdue";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  left: {
    label: "Left",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        status === "active" && "bg-success",
        status === "inactive" && "bg-muted-foreground",
        status === "left" && "bg-destructive",
        status === "pending" && "bg-warning",
        status === "completed" && "bg-success",
        status === "overdue" && "bg-destructive"
      )} />
      {config.label}
    </span>
  );
}
