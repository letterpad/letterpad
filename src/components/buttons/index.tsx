import ButtonOriginal, {
  ButtonProps as ButtonPropsOriginal,
  ButtonType as ButtonTypeOriginal,
} from "antd/lib/button/button";
import React from "react";

// require("./button.css");
type Mod<T, R> = Omit<T, keyof R> & R;
const customTypeArray = [
  "success",
  "warning",
  "info",
  "dark",
  "lightdark",
  "danger",
] as const;
const customWithArray = ["link", "dashed", "ghost"] as const;
export type ButtonType = ButtonTypeOriginal | typeof customTypeArray[number];
type withProps = typeof customWithArray[number];
type ModButtonProps = Mod<
  ButtonPropsOriginal,
  {
    type?: ButtonType;
  }
>;

export type ButtonProps = ModButtonProps & {
  with?: withProps;
  style?: React.CSSProperties;
};

const styleButton = {
  dashed: {
    borderStyle: "dashed",
  },
  ghost: {
    borderStyle: "solid",
  },
  link: {
    borderStyle: "none",
    boxShadow: "none",
    borderColor: "transparent",
  },
};

const disableAnimation = "disable-animation";

export const EnhancedButton = (props: ButtonProps) => {
  const _isLink = props.with === "link";
  const _isDashed = props.with === "dashed";
  const _isGhost = props.with === "ghost";
  const _type = props.type;
  const _ghost: boolean =
    _isDashed || _isGhost || _isLink || props.ghost ? true : false;
  const _style = props.with ? styleButton[props.with] : undefined;
  const _linkStyle = _isLink ? disableAnimation : undefined;
  const _classes = [_linkStyle, props.className].filter((x) => !!x).join(" ");

  const { type, ...rest } = props;
  return (
    <ButtonOriginal
      {...rest}
      className={_classes}
      style={{ ..._style, ...props.style }}
      ghost={_ghost}
      {...(_type ? { type: _type as any } : {})}
    >
      {props.children}
    </ButtonOriginal>
  );
};

EnhancedButton.displayName = "EnhancedButton";
