import { useRef, useEffect, VFC } from "react";
import clipboard from "clipboard";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface Props {
  elementId: string;
}

export const CopyToClipboard: VFC<Props> = ({ elementId }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const target = document.querySelector(`#${elementId}`);
    if (buttonRef.current && target) {
      new clipboard(buttonRef.current, {
        target: () => target,
      });
    }
  }, [buttonRef.current]);

  return (
    <>
      <Button ref={buttonRef} icon={<CopyOutlined />} type="link">
        Copy
      </Button>
    </>
  );
};
