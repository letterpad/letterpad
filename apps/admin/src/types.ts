/* eslint-disable @typescript-eslint/no-namespace */

import { Navigation, Setting } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { SessionData } from "@/graphql/types";
export type Optional<T> = { [P in keyof T]?: T[P] };

export interface IMenuWithError extends Navigation {
  hasError?: boolean;
  id: number;
}

export interface INavigationBuilderProps {
  menuData: Navigation[];
  updateOption: (menu: Navigation[]) => void;
}

export interface IAuthComponentProps {
  session: SessionData;
  settings: Setting;
}

export interface IUploadFileProps {
  files: File[] | FileList;
  type?: string;
}

export enum MediaProvider {
  Unsplash = "unsplash",
  Letterpad = "letterpad",
}

export interface TypeMediaInsert {
  src: string;
  caption?: string;
  width?: number;
  height?: number;
  // for unsplash images
  download_location?: string;
}

export type PubSubEvent = "save" | "noop" | "networkError";

export interface ClientTokenData {
  id: number;
}

export interface ForgotPasswordToken {
  email: string;
}

export interface UnsubscribeToken {
  email: string;
  author_id: number;
  subscriber_id: number;
}

export interface VerifyUserToken {
  email: string;
  author_id: number;
}

export interface VerifySubscriberToken {
  email: string;
  author_id: number;
  subscriber_id: number;
}

export type VerifyUserOrSubscriberToken = VerifyUserToken &
  VerifySubscriberToken;

export interface PageProps {
  settings: SettingsFragmentFragment;
  session: SessionData;
}
