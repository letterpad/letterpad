import { subscribe } from "@/shared/eventBus";

import { useState, useEffect } from "react";

export const useSavingIndicator = () => {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    subscribe("save", () => {
      clearTimeout(timeout);
      setSaving(true);
      timeout = setTimeout(() => {
        setSaving(false);
      }, 1000);
    });
  }, []);

  const Component = (
    <div style={{ height: 14 }}>{saving ? "Saving" : null}</div>
  );

  return Component;
};
