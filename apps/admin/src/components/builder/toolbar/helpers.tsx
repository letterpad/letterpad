import classNames from "classnames";

import { IconClose } from "./icons";

export const Reset = ({ visible, onClick, className }) => {
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
