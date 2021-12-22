export enum EventAction {
  Load = "load",
  View = "view",
  Click = "click",
}

export interface EventInfo {
  eventCategory: string;
  eventAction: EventAction;
  eventLabel: string;
}

export const track = (info: EventInfo) => {
  if (typeof window === "undefined") return;
  if (typeof window.ga === "undefined") return;
  window.ga("send", {
    hitType: "event",
    ...info,
  });
};
