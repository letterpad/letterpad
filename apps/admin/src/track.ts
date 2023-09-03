import { track as doTrack } from "./utils/useTracking";

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
  doTrack(info);
};
