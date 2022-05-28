import { CopyOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import clipboard from "clipboard";
import { useEffect, useRef, VFC } from "react";

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
  }, [elementId]);

  return (
    <>
      <Button
        ref={buttonRef}
        icon={<CopyOutlined />}
        type="link"
        onClick={() => message.success({ content: "Copied", key: "copy" })}
      >
        Copy
      </Button>
    </>
  );
};
