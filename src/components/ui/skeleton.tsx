
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-crypto-gray-dark/30",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-crypto-purple/20 before:to-transparent before:animate-pulse-glow",
        "after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)] after:animate-shimmer",
        "border border-crypto-purple/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
