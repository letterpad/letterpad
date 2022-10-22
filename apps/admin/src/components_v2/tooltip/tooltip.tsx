import {
  arrow,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useFloating,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import React, { useRef } from "react";

import { useFlag } from "./useFlag";

type TooltipProps = {
  children: React.ReactElement;
  disabled?: boolean;
  follow?: boolean;
  render: React.ReactNode;
};

export const Tooltip = ({
  follow = false,
  disabled = false,
  render,
  children,
}: TooltipProps) => {
  const arrowRef = useRef(null);
  const { flag, onToggleSwitch } = useFlag(false);
  const { context, reference, floating, strategy, x, y, placement } =
    useFloating({
      placement: "bottom",
      open: flag,
      onOpenChange: onToggleSwitch,
      middleware: [
        offset(4),
        flip(),
        shift(),
        arrow({ element: arrowRef, padding: 8 }),
      ],
    });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
  ]);

  return (
    <React.Fragment>
      {React.cloneElement(
        children,
        getReferenceProps({
          ref: reference,
          ...children.props,
        }),
      )}
      <FloatingPortal id="tooltip-portal">
        {flag && !disabled && (
          <div
            role="tooltip"
            data-placement={placement}
            {...getFloatingProps({
              ref: floating,
              style: {
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                maxWidth: "400px",
                // background: "black",
                // color: "white",
                padding: "8px",
              },
            })}
          >
            <div onClick={() => onToggleSwitch(false)}>{render}</div>
          </div>
        )}
      </FloatingPortal>
    </React.Fragment>
  );
};

export default Tooltip;
