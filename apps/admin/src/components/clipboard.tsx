import clipboard from "clipboard";
import { useEffect, useRef, VFC } from "react";
import { MdContentCopy } from "react-icons/md";
import { Button, Message } from "ui";

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
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          Message().success({ content: "Copied" });
        }}
      >
        <MdContentCopy size={16} />
        &nbsp;
        <span>Copy</span>
      </Button>
    </>
  );
};
