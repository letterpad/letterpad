import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

interface Base {
  footer?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
}
interface PropsWithState extends Base{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "state";
}
interface PropsWithTrigger extends Base{ 
  trigger: React.ReactNode;
  type: "trigger";
}

type Props = PropsWithState | PropsWithTrigger

export { DialogClose } from "./dialog";

export function DialogModal({footer, title, description, children, ...rest}: Props) {
  const controlProps = rest.type === "state" ? { open:rest.open, onOpenChange:rest.onOpenChange } : { }
  return (
    <Dialog {...controlProps}>
      <DialogTrigger asChild>
        {rest.type === "trigger" && rest.trigger}
      </DialogTrigger>
      <DialogContent>
        {(title || description) && <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>
            {description}
          </DialogDescription>}
        </DialogHeader>}
        <div className="grid gap-4 py-4">
        {children}
        </div>
        {footer && 
          <DialogFooter className="sm:justify-start">
            {footer}
          </DialogFooter>
        }
      </DialogContent>
    </Dialog>
  )
}
