import classNames from "classnames";
import { FC, useEffect, useState } from "react";

import { clearText } from "./clear";
import { MessageMarkup } from "./content";
import { DisplayProps, InternalMessageProps, ModalProps } from "./types";
import { PopConfirm } from "../popconfirm";

interface Props extends DisplayProps {
  displayType?: "modal" | "message";
  onConfirm: () => void;
}

export const Wrapper: FC<Props> = ({ displayType, onConfirm, ...rest }) => {
  if (displayType === "modal") {
    return (
      <Modalify {...rest} onConfirm={onConfirm}>
        <MessageMarkup {...rest} showIcon={false} />
      </Modalify>
    );
  }

  return (
    <Sticky {...rest}>
      <MessageMarkup {...rest} showIcon={true} />
    </Sticky>
  );
};

const Modalify: FC<Omit<ModalProps, "displayType">> = ({
  children,
  onConfirm,
  title,
  className,
}) => {
  const [visible, setVisible] = useState(true);
  return (
    <PopConfirm
      title={title}
      visible={visible}
      onConfirm={() => {
        setVisible(false);
        onConfirm && onConfirm();
      }}
      className={className}
      okText="Ok"
      cancelText=""
      description={<div>{children}</div>}
    />
  );
};

const Sticky: FC<InternalMessageProps> = ({
  children,
  content,
  className,
  duration,
}) => {
  const textWidth = getTextWidth(content) + 120;
  const width = Math.min(textWidth, Math.min(window.innerWidth - 100, 500));

  useEffect(() => {
    clearText(duration);
  }, [duration]);

  return (
    <div
      className={classNames("fixed inset-x-0 top-2 z-50 mx-auto", className)}
      style={{ width }}
    >
      {children}
    </div>
  );
};

function getTextWidth(text: string, font = null) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font || getComputedStyle(document.body).font;
  return context.measureText(text).width;
}
