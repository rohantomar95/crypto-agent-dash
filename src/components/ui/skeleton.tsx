
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-crypto-gray-dark/30",
        "border border-crypto-purple/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
