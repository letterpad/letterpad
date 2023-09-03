import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const EventAction = {
  Load: "load",
  View: "view",
  Click: "click",
  Change: "change",
};

export const track = (info) => {
  if (typeof window === "undefined") return;
  if (typeof window.ga === "undefined") return;
  window.ga("send", {
    hitType: "event",
    ...info,
  });
};

const trackingId = "UA-120251616-1";

export const useTracking = () => {
  const router = useRouter();
  // Initialize ga
  useEffect(() => {
    if (window.ga) return;
    if (trackingId) {
      (function (i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        (i[r] =
          i[r] ||
          function () {
            // eslint-disable-next-line prefer-rest-params
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
        "ga"
      );

      window.ga("create", trackingId, "auto");
      window.ga("send", "pageview");
    }
  }, []);

  // track events automatically
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    setTimeout(() => {
      if (typeof window.ga === "undefined") return;
      const page = router?.pathname;
      window.ga("send", "pageview", page);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return track;
};
