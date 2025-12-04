import { cn } from "@/lib/utils";

type CategoryType = "Q1" | "Q2" | "Q3" | "Q4" | "A" | "B" | "C" | "D";

interface CategoryBadgeProps {
  category: CategoryType;
  showLabel?: boolean;
  className?: string;
}

const categoryConfig: Record<CategoryType, { label: string; color: string; bgColor: string }> = {
  Q1: { label: "Q1 (Jan-Mar)", color: "text-category-q1", bgColor: "bg-category-q1/10 border-category-q1/20" },
  Q2: { label: "Q2 (Apr-Jun)", color: "text-category-q2", bgColor: "bg-category-q2/10 border-category-q2/20" },
  Q3: { label: "Q3 (Jul-Sep)", color: "text-category-q3", bgColor: "bg-category-q3/10 border-category-q3/20" },
  Q4: { label: "Q4 (Oct-Dec)", color: "text-category-q4", bgColor: "bg-category-q4/10 border-category-q4/20" },
  A: { label: "Category A", color: "text-category-q1", bgColor: "bg-category-q1/10 border-category-q1/20" },
  B: { label: "Category B", color: "text-category-q2", bgColor: "bg-category-q2/10 border-category-q2/20" },
  C: { label: "Category C", color: "text-category-q3", bgColor: "bg-category-q3/10 border-category-q3/20" },
  D: { label: "Category D", color: "text-category-q4", bgColor: "bg-category-q4/10 border-category-q4/20" },
};

export function CategoryBadge({ category, showLabel = false, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {showLabel ? config.label : category}
    </span>
  );
}
