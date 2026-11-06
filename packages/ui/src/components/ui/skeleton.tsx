import { cn } from "cn"

// Placeholder with the shape of content that is loading. Pulses unless reduced motion is on (P18,
// globals.css); it is decorative, so the loading state is announced by LoadingMessage or aria-busy.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-sm bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
