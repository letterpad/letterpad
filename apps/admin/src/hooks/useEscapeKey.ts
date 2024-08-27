import { useEffect } from "react";

const ESCAPE_KEY = 27;

export const useEscapeKey = (callback) => {
  useEffect(() => {
    if (!window || !window.document || !callback) {
      return;
    }

    const onKeyPress = (event) =>
      event.keyCode === ESCAPE_KEY && callback(event);
    window.document.addEventListener("keydown", onKeyPress);
    return () => {
      window.document.removeEventListener("keydown", onKeyPress);
    };
  }, [callback]);
};
