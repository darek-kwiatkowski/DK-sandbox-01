import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// DevMentor button. Shape, density and states follow lekcja-06/tokeny.md and the stage 2
// differences table (packages/ui/POSTEP.md): 32 px / 24 px, rounded-md, one ink focus ring
// with an offset (rule 21), hover tokens instead of opacity (WCAG 1.4.3).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-in-group rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover",
        outline:
          "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:bg-secondary-hover aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-hover aria-expanded:bg-secondary-hover",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-secondary-hover aria-expanded:bg-accent",
        // A darker tint would drop the red text below 4.5 : 1 (WCAG 1.4.3), so hover and press add an edge.
        destructive:
          "bg-destructive/10 text-destructive hover:border-destructive active:border-destructive dark:bg-destructive/20",
        link: "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2 active:decoration-2",
      },
      size: {
        default: "h-8 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-6 px-2",
        icon: "size-8",
        "icon-sm": "size-6",
      },
    },
    compoundVariants: [
      // A link reads as text: no control height or padding (it sits inside sentences).
      { variant: "link", class: "h-auto px-0 has-data-[icon=inline-end]:pr-0 has-data-[icon=inline-start]:pl-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
