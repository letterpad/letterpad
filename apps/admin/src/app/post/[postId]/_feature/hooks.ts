import { useCallback, useEffect, useState } from "react";

export const useActivateEditorChangeAfterClick = () => {
  const [active, setActive] = useState(false);

  const activateChangeAction = useCallback(() => {
    setActive(true);
    document.removeEventListener("click", activateChangeAction);
  }, []);

  useEffect(() => {
    document.addEventListener("click", activateChangeAction);
    return () => document.removeEventListener("click", activateChangeAction);
  }, [activateChangeAction]);

  return active;
};
