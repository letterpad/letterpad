import classNames from "classnames"

function Skeleton({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={classNames("animate-pulse bg-primary/10", className)}
        {...props}
      />
    )
  }
  
  export { Skeleton }