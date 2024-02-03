import { useCallback, useEffect } from "react";

interface Props {
  targetKey: string;
  onKeyPress: (event: KeyboardEvent) => void;
  enable?: boolean
}
export const useKeyPress = (
  { targetKey, onKeyPress, enable = true }: Props
): void => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enable || event.key !== targetKey) return;
      onKeyPress(event);
    },
    [enable, targetKey, onKeyPress]
  );

  useEffect(() => {
    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyPress]);
};

