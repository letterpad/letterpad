import React from "react";

import { clearText } from "./clear";
import { root } from "./root";
import { DisplayProps, Props } from "./types";
import { Wrapper } from "./wrapper";

export const Message = () => {
  clearText(0);
  return {
    success: (props: Props) => {
      Display({ ...props, success: true });
    },
    error: (props: Props) => {
      Display({ ...props, error: true });
    },
    warn: (props: Props) => {
      Display({ ...props, warn: true });
    },
    loading: (props: Props) => {
      Display({ ...props, loading: true });
    },
    destroy: () => {
      root.render(<span />);
    },
  };
};

const Display = (
  props: DisplayProps & { displayType?: "modal" | "message" },
) => {
  const { displayType, duration, title, ...rest } = props;

  root.render(
    <Wrapper
      {...props}
      onConfirm={() => {
        clearText(0);
      }}
    />,
  );
};
