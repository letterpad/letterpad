import axios from "axios";
import { basePath } from "next.config";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import FileExplorer from "@/components/file-explorer";

import { IMediaUploadResult } from "@/graphql/types";

import { Preview } from "./preview";
import { Buttonv2 } from "../button";
import { Label } from "../input";

interface Props {
  progress?: (percentCompleted: number) => void;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  url: string;
  className?: string;
  label?: string;
}

const noop = () => {};
interface UploadFileList {
  url: string;
}

export const Upload: FC<Props> = ({
  progress = noop,
  onSuccess = noop,
  onError = noop,
  url,
  label,
  className,
}) => {
  const [fileList, setFileList] = useState<UploadFileList[]>([]);
  const [explorerVisible, setExplorerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (url) {
      setFileList([{ url }]);
    }
  }, [url]);

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return null;
    const config = {
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        progress(percentCompleted);
      },
    };

    let data = new FormData();
    data.append("file", event.target.files[0]);
    setUploading(true);
    axios
      .put(basePath + "/api/uploadApi", data, config)
      .then((res) => handleSuccess(res.data))
      .catch((err) => onError(err))
      .finally(() => {
        setUploading(false);
      });
  };

  const handleSuccess = (data) => {
    onSuccess(data);
    setFileList(data);
  };

  return (
    <div>
      {label && (
        <>
          <br />
          <Label label={label} className="mb-3" />
        </>
      )}
      <div className={className}>
        <div
          onClick={() => {
            if (fileList.length > 0) return;
            setExplorerVisible(true);
          }}
          className="h-full w-full cursor-pointer rounded-md dark:border-gray-700"
        >
          <input
            type="file"
            className="hidden"
            onChange={uploadImage}
            ref={ref}
          />
          <Preview url={url} onRemove={handleSuccess} loading={uploading} />
        </div>
        <FileExplorer
          isVisible={explorerVisible}
          handleCancel={() => setExplorerVisible(false)}
          onInsert={async (files) => {
            const result: IMediaUploadResult[] = files.map((item) => {
              return {
                src: item.src,
                name: "does-not-matter",
                caption: item.caption,
                error: "",
                size: {
                  width: (item.width || 0) as number,
                  height: (item.height || 0) as number,
                  type: "",
                },
              };
            });

            handleSuccess(result);
            setExplorerVisible(false);
            return Promise.resolve(result);
          }}
        />
      </div>
    </div>
  );
};
