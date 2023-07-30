//@ts-nocheck
import { useRouter } from "next/router";
import { useEffect } from "react";

import { gaTrackingId } from "@/constants";

export const useTracking = (userId?: number) => {
  const trackingId = gaTrackingId;

  const router = useRouter();
  // Initialize ga
  // useEffect(() => {
  //   // if (process.env.NODE_ENV !== "production") return;
  //   if (trackingId && !window.ga) {
  //     (function (i, s, o, g, r, a, m) {
  //       i["GoogleAnalyticsObject"] = r;
  //       (i[r] =
  //         i[r] ||
  //         function () {
  //           // eslint-disable-next-line prefer-rest-params
  //           (i[r].q = i[r].q || []).push(arguments);
  //         }),
  //         (i[r].l = 1 * new Date());
  //       (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  //       a.async = 1;
  //       a.src = g;
  //       m.parentNode.insertBefore(a, m);
  //     })(
  //       window,
  //       document,
  //       "script",
  //       "https://www.google-analytics.com/analytics.js",
  //       "ga"
  //     );

  //     window.ga("create", trackingId, "auto");
  //     window.ga("send", "pageview");
  //   }
  //   if (userId) {
  //     window.ga("set", "dimension1", userId);
  //     window.ga("set", "userId", userId);
  //   }
  // }, [trackingId, userId]);

  // // track events automatically
  // useEffect(() => {
  //   if (process.env.NODE_ENV !== "production") return;
  //   setTimeout(() => {
  //     if (typeof window.ga === "undefined") return;
  //     const page = router.basePath + router.pathname;
  //     window.ga("send", "pageview", page);
  //   }, 0);
  // }, [router.basePath, router.pathname]);

  return null;
};
