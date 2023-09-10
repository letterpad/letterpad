import { useEffect, useState } from "react";

export const useActivateUpdateAllowed = () => {
  const [allowChange, setAllowChange] = useState(false);

  const activateChangeAction = () => {
    setAllowChange(true);
  };

  useEffect(() => {
    document.addEventListener("click", activateChangeAction);
    return () => document.removeEventListener("click", activateChangeAction);
  }, []);

  return allowChange;
};
