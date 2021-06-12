import { IMediaUploadResult } from "@/graphql/types";
import nextConfig from "../next.config";
interface IUploadFileProps {
  files: File[] | FileList;
  type?: string;
}

export const uploadFile = ({
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

  return fetch(nextConfig.basePath + "/api/customRequest", {
    method: "post",
    body: data,
    headers: {
      authorization: localStorage["next-auth.session-token"],
    },
  })
    .then(data => {
      return data.json();
    })
    .then(async image => {
      return image;
    });
};
