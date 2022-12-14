import clipboard from "clipboard";
import { useEffect, useRef, VFC } from "react";
import { MdContentCopy } from "react-icons/md";

import { Buttonv2 } from "@/components_v2/button";
import { Message } from "@/components_v2/message";

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
      <Buttonv2
        ref={buttonRef}
        variant="ghost"
        onClick={() => Message().success({ content: "Copied" })}
      >
        <MdContentCopy size={16} />
        &nbsp;
        <span>Copy</span>
      </Buttonv2>
    </>
  );
};
