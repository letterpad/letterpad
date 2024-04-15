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

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
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

const isClient = typeof window !== "undefined";
export const getEdgeConfigClient = () => {
  return (isClient) ? window['edgeConfig'] as Record<string, any> : null
}

export function dirtyValues<T>(
  dirtyFields: object | boolean,
  allValues: T
): Partial<T> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      dirtyValues(dirtyFields[key], allValues[key]),
    ])
  ) as Partial<T>;
}


interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

export const resizeImageClient = (settings: IResizeImageOptions): Promise<Blob> => {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions to fit under maxSizeInMB
        const maxSizeInBytes = settings.maxSize * 1024 * 1024;
        let width = img.width;
        let height = img.height;
        let scaleFactor = 1;

        while ((width * height * (scaleFactor ** 2)) > maxSizeInBytes) {
          scaleFactor -= 0.1;
          width = Math.floor(img.width * scaleFactor);
          height = Math.floor(img.height * scaleFactor);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/jpeg', 0.9); // Adjust quality (0.0 - 1.0) to reduce file size
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(settings.file);
  });
};
