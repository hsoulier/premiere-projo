"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "@heroicons/react/24/outline"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-700 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    checked={checked}
    {...props}
  >
    <CheckboxPrimitive.Indicator asChild>
      <div className="size-full flex items-center justify-center text-current">
        {checked === true && <CheckIcon className="size-4" />}
        {checked === "indeterminate" && (
          <div className="size-full bg-primary h-full flex items-center justify-center">
            <div className="h-0.5 mx-[2px] w-full bg-primary-foreground rounded-full relative z-10" />
          </div>
        )}
      </div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
