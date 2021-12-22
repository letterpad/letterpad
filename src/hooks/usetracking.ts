//@ts-nocheck
import config from "../../next.config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useTracking = () => {
  const trackingId = config.gaTrackingId;
  const router = useRouter();
  // Initialize ga
  useEffect(() => {
    if (trackingId) {
      (function (i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        (i[r] =
          i[r] ||
          function () {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        "script",
        "https://www.google-analytics.com/analytics.js",
        "ga",
      );

      window.ga("create", trackingId, "auto");
      window.ga("send", "pageview");
    }
  }, [trackingId]);

  // track events automatically
  useEffect(() => {
    setTimeout(() => {
      if (typeof window.ga === "undefined") return;
      const page = router.basePath + router.pathname;
      window.ga("send", "pageview", page);
    }, 0);
  }, [router.pathname]);

  return null;
};
