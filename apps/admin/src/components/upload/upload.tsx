import axios from "axios";
import classNames from "classnames";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Label } from "ui";

import { FileExplorer } from "@/components/file-explorer";

import { IMediaUploadResult } from "@/graphql/types";
import { mapFileListToArray } from "@/shared/utils";

import { Preview } from "./preview";
import { DropZone } from "../post/components/dragdrop";
import { basePath } from "../../constants";

interface Props {
  progress?: (percentCompleted: number) => void;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  url: string;
  className?: string;
  label?: string;
  emptyIcon?: ReactNode;
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
  emptyIcon,
}) => {
  const [fileList, setFileList] = useState<UploadFileList[]>([]);
  const [explorerVisible, setExplorerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (url) {
      setFileList([{ url }]);
    }
  }, [url]);

  const uploadImage = (files: File[]) => {
    if (!files) return null;
    const config = {
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progress(percentCompleted);
      },
    };

    let data = new FormData();
    data.append("file", files[0]);
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

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  return (
    <DropZone
      onDragStateChange={onDragStateChange}
      onFilesDrop={uploadImage}
      className={classNames("relative border-2", {
        "rounded-md  border-green-500": isDropActive,
        "border-transparent": !isDropActive,
      })}
    >
      {label && (
        <>
          <br />
          <Label label={label} className="mb-3" />
        </>
      )}
      <div
        className={classNames(
          "bg-gray-200  text-gray-800 dark:bg-gray-700 dark:text-gray-600",
          className
        )}
      >
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
            onChange={(event) =>
              event.target.files &&
              uploadImage(mapFileListToArray(event.target.files))
            }
            ref={ref}
          />
          <Preview
            url={url}
            onRemove={handleSuccess}
            loading={uploading}
            openFileExplorer={() => setExplorerVisible(true)}
            emptyIcon={emptyIcon}
          />
        </div>
        <FileExplorer
          multi={false}
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
    </DropZone>
  );
};
