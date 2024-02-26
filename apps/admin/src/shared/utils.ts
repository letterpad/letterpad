import dayjs from "dayjs";

import { basePath } from "@/constants";
import { IMediaUploadResult } from "@/graphql/types";

import { IUploadFileProps } from "../types";
import { getAuthCookieName } from "../utils/authCookie";
export const getReadableDate = (timestamp: Date | number | string) => {
  return dayjs(timestamp).format('MMM D, YYYY')
};

export const getDateTime = (d?: Date) => {
  return dayjs(d).format('YYYY-MM-DDTHH:mm:ssZ[Z]');
};

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
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
      authorization: localStorage[getAuthCookieName()],
    },
  })
    .then((data) => {
      return data.json();
    })
    .then(async (image) => {
      return image;
    });
};

export function removeTypenames<T>(data: T = {} as T): Omit<T, "__typename"> {
  const omitTypename = <K extends string>(key: K, value: T) => {
    if (typeof key === "string" && key === "__typename") {
      return undefined;
    }
    return value;
  };

  return JSON.parse(JSON.stringify(data), omitTypename);
}

const expr = /^[a-z0-9_]*$/;
const bannedUsernames = ["admin", "administrator", "moderator", "mod"];
export const sanitizeUsername = (username: string) => {
  if (bannedUsernames.includes(username)) return false;
  return expr.test(username);
};

export const mapFileListToArray = (files: FileList) => {
  const array: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file) array.push(file);
  }

  return array;
};

export const TOPIC_PREFIX = "_topic_";

export const replaceLpTopicTagPrefix = (str: string) => {
  return str.replace(TOPIC_PREFIX, "");
}

export const beautifyTopic = (str: string) => {
  return replaceLpTopicTagPrefix(str).replaceAll("-", " ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    )
}

export const isMembershipFeatureActive = () => {
  return process.env.NEXT_PUBLIC_PAYMENTS_ACTIVE === "true"
}