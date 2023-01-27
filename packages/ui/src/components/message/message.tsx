import { clearText } from "./clear";
import { portal } from "./root";
import { DisplayProps, Props } from "./types";
import { Wrapper } from "./wrapper";

const duration = 3;
export const Message = () => {
  clearText(0);
  return {
    success: (props: Props) => {
      Display({ duration, ...props, success: true });
    },
    error: (props: Props) => {
      Display({ duration, ...props, error: true });
    },
    warn: (props: Props) => {
      Display({ duration, ...props, warn: true });
    },
    loading: (props: Props) => {
      Display({ duration, ...props, loading: true });
    },
    destroy: () => {
      portal.show(<span />);
    },
  };
};

const Display = (
  props: DisplayProps & { displayType?: "modal" | "message" }
) => {
  const { displayType, title, ...rest } = props;

  portal.show(
    <Wrapper
      {...props}
      onConfirm={() => {
        clearText(0);
      }}
    />
  );
};
