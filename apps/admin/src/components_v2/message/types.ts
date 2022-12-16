import { ReactNode } from "react";

interface BaseProps {
  className?: string;
  content: ReactNode;
  children?: ReactNode;
}

export interface MessageProps extends BaseProps {
  duration?: number;
  content: string;
  displayType?: "message";
}

export interface ModalProps extends BaseProps {
  displayType: "modal";
  title?: string;
  onConfirm?: () => void;
}

export type Props = MessageProps | ModalProps;

export interface DisplayProps extends MessageType {
  content: any;
  title?: string;
  duration?: number;
}

interface MessageType {
  success?: boolean;
  error?: boolean;
  warn?: boolean;
  loading?: boolean;
}
export interface InternalMessageProps extends MessageType, MessageProps {
  showIcon?: boolean;
}
