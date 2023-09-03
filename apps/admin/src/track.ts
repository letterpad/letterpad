export enum EventAction {
  Load = "load",
  View = "view",
  Click = "click",
  Change = "change",
}

export interface EventInfo {
  eventCategory: string;
  eventAction: EventAction;
  eventLabel: string;
}

export const track = (info: EventInfo) => {
  gtag("event", info.eventAction, {
    event_category: info.eventCategory,
    event_label: info.eventLabel,
  });
};
