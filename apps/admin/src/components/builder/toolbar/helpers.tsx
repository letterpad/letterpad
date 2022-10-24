import classNames from "classnames";
import { FC } from "react";

import { IconClose } from "./icons";

interface Props {
  visible: boolean;
  onClick: () => void;
  className?: string;
}

export const Reset: FC<Props> = ({ visible, onClick, className }) => {
  if (!visible) return null;

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={classNames("absolute cursor-pointer", className)}
      style={{
        transform: "translate(-50%, 50%)",
        fontSize: 12,
        color: "rgb(var(--color))",
      }}
    >
      <IconClose size={18} />
    </span>
  );
};
