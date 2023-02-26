import * as React from 'react'

import { cn } from '../../lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-border text-white focus:border-0 transition focus:border-primary-button bg-transparent py-2 px-3 text-sm placeholder:text-gray-text focus:outline-none focus:ring-2 focus:ring-primary-button disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-border',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
