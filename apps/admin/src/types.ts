/* eslint-disable @typescript-eslint/no-namespace */

import DiffMatchPatch from "diff-match-patch";
import { DefaultUser } from "next-auth";

import { Navigation, RegisterStep, Setting } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { ROLES, SessionData } from "@/graphql/types";

import { Author, Post, Setting as DbSetting } from "../drizzle/schema";

export type DbPost = typeof Post.$inferSelect;
export type DbAuthor = typeof Author.$inferSelect;
export type DbSetting = typeof DbSetting.$inferSelect;

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      username: string;
      avatar: string;
      name: string;
      id: number;
      role: ROLES;
      register_step: RegisterStep;
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROOT_URL: string;
      PWD: string;
      SECRET_KEY: string;
      RECAPTCHA_KEY_CLIENT: string;
      RECAPTCHA_KEY_SERVER: string;
      SENDGRID_API_KEY: string;
      MJ_APIKEY_PUBLIC: string;
      MJ_APIKEY_PRIVATE: string;
      CLOUDINARY_KEY?: string;
      STRIPE_SECRET_KEY?: string;
      CLOUDINARY_SECRET?: string;
      CLOUDINARY_NAME?: string;
      UNSPLASH_CLIENT_ID?: string;
      DATABASE_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      STRIPE_PRICE_ID: string;
    }
  }
}

export type Optional<T> = { [P in keyof T]?: T[P] };

export interface IMenuWithError extends Navigation {
  hasError?: boolean;
  id: number;
}

export interface INavigationBuilderProps {
  menuData: Navigation[];
  updateOption: (menu: Navigation[]) => void;
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

export enum AdminUsersType {
  RECENT_USERS = "recent_users",
  TOP_USERS = "top_users",
  DOMAIN_MAPPED = "domain_mapped",
}

export interface PostHistoryItem {
  timestamp: string;
  content?: string;
  patches: DiffMatchPatch.Patch[];
  active: boolean;
  live: boolean;
}
