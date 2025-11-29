import * as React from "react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all",
      className
    )}
    ref={ref}
    {...props}
  />
))

Checkbox.displayName = "Checkbox"

export { Checkbox }