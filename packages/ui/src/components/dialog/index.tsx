import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

interface Props {
    footer?: React.ReactNode;
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
}
export function DialogModal({footer, trigger, title, description, children}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {(title || description) && <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>
            {description}
          </DialogDescription>}
        </DialogHeader>}
        <div className="grid gap-4 py-4">
        {children}
        </div>
        {footer && <DialogFooter>
          {footer}
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
