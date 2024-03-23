import { cva,VariantProps } from "class-variance-authority"
import classNames from "classnames"
import { forwardRef } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        success: "text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 rounded-lg text-sm text-center dark:text-white  dark:focus:ring-primary-900",
        primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-100",
        danger:"bg-red-500 text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
        outline: "border border-slate-400 dark:border-slate-600 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black",
        secondary:"border dark:border-slate-600 border-slate-900 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-gray-900 hover:text-black",
        ghost: "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200",
        link: "text-black dark:text-white hover:underline",
      },
      size: {
        normal: "h-10 py-2 px-4",
        small: "h-9 px-3 rounded-md",
        extrasmall: "h-7 px-1.5 rounded-md text-xs",
        large: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "normal",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={classNames(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }