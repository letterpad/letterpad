import { EventAction, EventCategory, EventLabel } from 'ui/dist/isomorphic.mjs';

interface EventInfo {
  eventCategory: EventCategory;
  eventAction: EventAction;
  eventLabel: EventLabel | string;
}

export const track = (info: EventInfo) => {
  window?.['dataLayer']?.push({
    event: 'GAEvent',
    eventAction: info.eventAction,
    eventCategory: info.eventCategory,
    eventLabel: info.eventLabel,
  });
};

export { EventAction, EventCategory, EventLabel };
