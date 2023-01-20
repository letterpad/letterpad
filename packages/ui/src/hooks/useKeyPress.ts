import { useCallback, useEffect, useState } from "react";

interface UseKeyPressOptions {
  targetKey: KeyboardEvent["key"];
}

export function useKeyPress({ targetKey }: UseKeyPressOptions): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey]
  );

  const upHandler = useCallback(
    ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    },
    [targetKey]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
}
