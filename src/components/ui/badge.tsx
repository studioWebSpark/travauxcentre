import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:   "border-transparent bg-[var(--color-navy)] text-white",
        orange:    "border-transparent bg-[var(--color-orange)] text-white",
        outline:   "border-[var(--color-navy)]/30 text-[var(--color-navy)] bg-transparent",
        ghost:     "border-transparent bg-white/10 text-white backdrop-blur-sm",
        success:   "border-transparent bg-emerald-100 text-emerald-800",
        warning:   "border-transparent bg-amber-100 text-amber-800",
        danger:    "border-transparent bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
