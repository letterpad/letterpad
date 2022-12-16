import React, { useEffect } from "react";
import ReactDom from "react-dom";

import { clearText } from "./clear";
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
      node={node}
    />,
    node,
  );
};
