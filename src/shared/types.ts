import { SessionData } from "@/graphql/types";
import { Navigation, Setting } from "@/__generated__/__types__";

export type Optional<T> = { [P in keyof T]?: T[P] };
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
      SENTRY_AUTH_TOKEN?: string;
      SENTRY_DSN?: string;
      CLOUDINARY_KEY?: string;
      CLOUDINARY_SECRET?: string;
      CLOUDINARY_NAME?: string;
      UNSPLASH_CLIENT_ID?: string;
      DATABASE_URL: string;
    }
  }
}
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

export type PubSubEvent = "save" | "noop";

export interface ClientTokenData {
  id: number;
}
