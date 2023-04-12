import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva('', {
  variants: {
    variant: {
      spheron:
        'rounded-full button__bg hover:bg-primary-buttonHover transition-all ease-in-out text-white px-2',
      default:
        'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
      destructive:
        'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
      outline:
        'flex items-center justify-center text-gray-unaryBorder font-bold border-2 rounded-full border-gray-unaryBorder',
      subtle:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
      link: 'bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
      navbar: 'bg-gray-navBtnBg',
      cancel:
        'rounded-full bg-white bg-opacity-10 hover:bg-opacity-5 transition-all ease-in-out text-white px-2',
    },
    size: {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-2 rounded-md',
      lg: 'h-11 px-8 rounded-md',
    },
  },
  defaultVariants: {
    variant: 'spheron',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
