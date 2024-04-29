/* eslint-disable no-unused-vars */
import { Navigation, RegisterStep, SettingsFragmentFragment } from "letterpad-graphql";
import { DefaultUser } from "next-auth";

import { ROLES, SessionData } from "@/graphql/types";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      username: string;
      avatar: string;
      name: string;
      id: string;
      role: ROLES;
      register_step: RegisterStep;
      membership: "free" | "complete" | "cancelled" | "profree" | "trialing" | "active";
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
  Upload = "upload"
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
  author_id: string;
  subscriber_id: number;
}

export interface VerifyUserToken {
  email: string;
  author_id: string;
}

export interface VerifySubscriberToken {
  email: string;
  author_id: string;
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
