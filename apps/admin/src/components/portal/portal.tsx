import { useRef } from "react";
import { createPortal } from "react-dom";

const isBrowser = typeof window !== "undefined";
function usePortal(id: string) {
  const rootElemRef = useRef<HTMLDivElement>(null);

  function getRootElem() {
    if (!rootElemRef.current) {
      const node = isBrowser && document.querySelector(`#${id}`);
      if (!node) {
        // eslint-disable-next-line no-console
        console.error(`Element with id ${id} not found`);
      }
      //@ts-ignore
      rootElemRef.current = node;
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export const Portal = ({ id, children }) => {
  const target = usePortal(id);
  if (!target) return children;
  return createPortal(children, target);
};
