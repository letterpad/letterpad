import { SessionData } from "@/graphql/types";
import { Navigation, Setting } from "@/__generated__/__types__";

export type Optional<T> = { [P in keyof T]?: T[P] };
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROOT_URL: string;
      PWD: string;
      SECRET_KEY: string;
      RECAPTCHA_KEY: string;
      SENDGRID_API_KEY: string;
      MJ_APIKEY_PUBLIC: string;
      MJ_APIKEY_PRIVATE: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_PORT: number;
      DB_NAME: string;
      SENTRY_AUTH_TOKEN?: string;
      SENTRY_DSN?: string;
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
