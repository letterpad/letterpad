import { Message } from "ui/dist/index.mjs";

import { EventAction, EventCategory, EventLabel, track } from "../../../track";

export const checkout = async () => {
  try {
    const response = await fetch("/api/checkout_sessions", { method: "POST" });
    if (response.redirected) {
      window.location.assign(response.url);
      return;
    }
    const { url, message } = await response.json();
    if (!response.ok || !url) {
      Message().error({ content: message || "Checkout is unavailable." });
      return;
    }

    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.Membership,
      eventLabel: EventLabel.Checkout,
    });
    window.location.assign(url);
  } catch {
    Message().error({ content: "Checkout is unavailable. Please try again." });
  }
};
