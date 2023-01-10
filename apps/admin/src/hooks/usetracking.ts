import { useRouter } from "next/router";
import { useEffect } from "react";

import { gaTrackingId } from "@/constants";

export const useTracking = (user_id?: number) => {
  const router = useRouter();
  useEffect(() => {
    // @ts-ignore
    if (user_id && typeof gtag !== "undefined") {
      // @ts-ignore
      gtag("config", gaTrackingId, {
        user_id,
      });
    }
  }, [user_id]);

  return null;
};
