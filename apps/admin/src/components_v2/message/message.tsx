import React from "react";

import { clearText } from "./clear";
import { portal } from "./root";
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
      portal.show(<span />);
    },
  };
};

const Display = (
  props: DisplayProps & { displayType?: "modal" | "message" }
) => {
  const { displayType, duration, title, ...rest } = props;

  portal.show(
    <Wrapper
      {...props}
      onConfirm={() => {
        clearText(0);
      }}
    />
  );
};
