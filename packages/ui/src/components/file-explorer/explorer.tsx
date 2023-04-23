import { ReactChild, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Button } from "../button";
import { Modal } from "../modal";

type TypeMediaInsert = any;

interface IProps<T> {
  isVisible: boolean;
  handleCancel: () => void;
  multi?: boolean;
  onInsert: (images: TypeMediaInsert[]) => void;
  onImageFile?: (image: File[]) => Promise<string[]>;
  uploadFile?: any;
  provider: T;
  setProvider: (current: any) => void;
  renderProvider: (provider: T) => ReactChild;
  insertMedia: () => void;
  resetSelection: () => void;
  selectedUrls: TypeMediaInsert;
}
export const FileExplorer = <T extends any>({
  isVisible,
  handleCancel,
  multi = false,
  onInsert,
  uploadFile,
  provider,
  setProvider,
  renderProvider,
  insertMedia,
  selectedUrls,
  resetSelection,
}: IProps<T>) => {
  const [uploading, setUploading] = useState(false);

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const hasSelectedImages = Object.keys(selectedUrls).length > 0;
  if (!isVisible) return null;
  return (
    <Modal
      size="lg"
      className="file-explorer"
      header={
        <div className="flex items-center gap-4">
          Media
          {uploading && (
            <AiOutlineLoading3Quarters className="animate-spin" size={14} />
          )}
        </div>
      }
      show={isVisible}
      toggle={handleCancel}
      zIndex={1301} // 1300 is tinymce insert toolbar
      footer={[
        <Button key="back" onClick={handleCancel} variant="ghost">
          Cancel
        </Button>,
        hasSelectedImages ? (
          <Button key="insert" onClick={insertMedia}>
            Insert
          </Button>
        ) : null,
        <Button
          key="upload"
          onClick={() => {
            hiddenInputRef.current?.click();
          }}
        >
          Browse
        </Button>,
        <Button
          key="provider"
          onClick={() => {
            resetSelection();
            setProvider(provider === "internal" ? "unsplash" : "internal");
          }}
        >
          {provider === "unsplash" ? "My Media" : "Search Online"}
        </Button>,
      ]}
    >
      {renderProvider(provider)}
      <input
        type="file"
        ref={hiddenInputRef}
        style={{ display: "none" }}
        multiple={multi}
        onChange={async (e) => {
          if (!e.target.files) return;
          const filesArr = Array.from(e.target.files);
          const fileSizeIncrease = filesArr.filter(
            (file) => file.size > 10000000
          );
          if (fileSizeIncrease.length > 0) {
            alert("File size should be less than 10MB");
            return;
          }
          setUploading(true);
          const result = await uploadFile({
            files: e.target.files,
            type: "cover_image",
          });
          setUploading(false);
          const urls = { ...selectedUrls };
          result.forEach((r: any) => {
            const {
              src,
              size: { width, height },
            } = r;
            urls[`${src}`] = { src, width, height, caption: "" };
          });
          onInsert(Object.values(urls));
        }}
      />
    </Modal>
  );
};
