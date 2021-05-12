import { Navigation } from "@/__generated__/type-defs.graphqls";

export type Optional<T> = { [P in keyof T]?: T[P] };
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROOT_URL: string;
      PWD: string;
      SECRET_KEY: string;
      RECAPTCHA_KEY: string;
      SENDGRID_API_KEY: string;
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
