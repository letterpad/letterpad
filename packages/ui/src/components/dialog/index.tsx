import classNames from "classnames";

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
  title?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
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

export function DialogModal({footer, title, description, children,contentClassName, ...rest}: Props) {
  const controlProps = rest.type === "state" ? { open:rest.open, onOpenChange:rest.onOpenChange } : { }
  return (
    <Dialog {...controlProps}>
      <DialogTrigger asChild>
        {rest.type === "trigger" && rest.trigger}
      </DialogTrigger>
      <DialogContent className={classNames("overflow-y-scroll max-h-screen",contentClassName)}>
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
