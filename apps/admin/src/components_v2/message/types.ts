import { ReactNode } from "react";

interface BaseProps {
  className?: string;
  content: ReactNode;
}

interface MessageProps extends BaseProps {
  duration?: number;
  displayType?: "message";
}

interface ModalProps extends BaseProps {
  displayType: "modal";
  title?: string;
}

export type Props = MessageProps | ModalProps;

export interface DisplayProps extends MessageType {
  content: any;
  title?: string;
  duration?: number;
  node: any;
}

interface MessageType {
  success?: boolean;
  error?: boolean;
  warn?: boolean;
  loading?: boolean;
}
export interface InternalMessageProps extends MessageType {
  content: string;
  showIcon?: boolean;
}
