import Router from "next/router";
import NProgress from "nprogress";

import { basePath } from "@/constants";
import { IMediaUploadResult } from "@/graphql/types";

import { IUploadFileProps } from "./types";

export const getReadableDate = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};

export const getDateTime = (d?: Date) => {
  const m = d ? new Date(d) : new Date();

  const dateString =
    m.getUTCFullYear() +
    "-" +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("0" + m.getUTCDate()).slice(-2) +
    " " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + m.getUTCSeconds()).slice(-2);

  return dateString;
};

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => Promise<any> {
  let timer: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(func(...args)), timeout);
    });
  };
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const uploadFile = async ({
  files,
  type,
}: IUploadFileProps): Promise<IMediaUploadResult[]> => {
  const data: FormData = new FormData();
  if (type) {
    data.append("type", type);
  }

  for (let i = 0; i < files.length; i++) {
    data.append(`file`, files[i]);
  }

  return fetch(basePath + "/api/uploadApi", {
    method: "post",
    body: data,
    headers: {
      authorization: localStorage["next-auth.session-token"],
    },
  })
    .then((data) => {
      return data.json();
    })
    .then(async (image) => {
      return image;
    });
};

export function removeTypenames<T>(data: T): Omit<T, "__typename"> {
  const omitTypename = <K extends string>(key: K, value: T) => {
    if (typeof key === "string" && key === "__typename") {
      return undefined;
    }
    return value;
  };

  return JSON.parse(JSON.stringify(data), omitTypename);
}

export function initPageProgress() {
  NProgress.configure({ showSpinner: true });
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());
}
