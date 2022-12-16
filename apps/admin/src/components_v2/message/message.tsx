import React from "react";
import ReactDom from "react-dom";

import { DisplayProps, Props } from "./types";
import { Wrapper } from "./wrapper";

export const Message = () => {
  const node = document.querySelector("#message");
  clearText(node, 0);
  return {
    success: (props: Props) => {
      Display({ ...props, node, success: true });
    },
    error: (props: Props) => {
      Display({ ...props, node, error: true });
    },
    warn: (props: Props) => {
      Display({ ...props, node, warn: true });
    },
    loading: (props: Props) => {
      Display({ ...props, node, loading: true });
    },
    destroy: () => {
      ReactDom.render(<span />, node);
    },
  };
};

const Display = (
  props: DisplayProps & { displayType?: "modal" | "message" },
) => {
  const { displayType, node, duration, title, ...rest } = props;

  ReactDom.render(
    <Wrapper
      {...props}
      onConfirm={() => {
        clearText(node, 0);
      }}
    />,
    node,
  );
};

let timeout;
const clearText = (node, DELAY) => {
  clearTimeout(timeout);
  if (DELAY === 0) {
    return ReactDom.render(<span />, node);
  }
  timeout = setTimeout(() => {
    ReactDom.render(<span />, node);
  }, DELAY * 1000);
};
