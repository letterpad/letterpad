import { EventAction, EventCategory, EventLabel } from "ui/dist/isomorphic.mjs"; // removed isomorphic;

interface EventInfo {
  eventCategory: EventCategory;
  eventAction: EventAction;
  eventLabel: EventLabel | string;
}

export const track = (info: EventInfo) => {
  gtag("event", info.eventAction, {
    event_category: info.eventCategory,
    event_label: info.eventLabel,
  });
};

export { EventAction, EventCategory, EventLabel };
