import { useCallback, useState } from "react";

export const useFlag = (initialValue = false) => {
  const [flag, setFlag] = useState(initialValue);

  const onToggleOn = useCallback(() => setFlag(true), []);
  const onToggleOff = useCallback(() => setFlag(false), []);
  const onToggleSwitch = useCallback(() => setFlag(!flag), [flag]);

  return { flag, onToggleOn, onToggleOff, onToggleSwitch };
};
