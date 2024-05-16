import { FC } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import ReactCrop, { type Crop } from "react-image-crop";
import { Button, DialogModal } from "ui/dist/index.mjs";

interface Props {
  showCropModal: boolean;
  setShowCropModal: (show: boolean) => void;
  uploading: boolean;
  saveCroppedImage: () => void;
  crop: Crop | undefined;
  setCrop: (crop: any) => void;
  tempFiles: File[] | null;
  imageRef: React.RefObject<HTMLImageElement>;
}
export const CropModal: FC<Props> = ({
  showCropModal,
  setShowCropModal,
  saveCroppedImage,
  uploading,
  tempFiles,
  crop,
  setCrop,
  imageRef,
}) => {
  return (
    <DialogModal
      contentClassName="lg:max-w-[50rem] mx-auto"
      open={showCropModal}
      onOpenChange={setShowCropModal}
      title="Crop Image"
      description="Select and drag to crop the image to the desired size."
      type="state"
      footer={[
        <Button
          variant="primary"
          onClick={() => setShowCropModal(false)}
          size="small"
        >
          Close
        </Button>,
        <Button
          variant="success"
          onClick={() => saveCroppedImage()}
          size="small"
          disabled={uploading}
        >
          Save
        </Button>,
      ]}
    >
      <div className="relative lg:max-w-[50rem] mx-auto">
        {uploading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center dark:bg-black/70 bg-white/70 z-50">
            <BiLoaderCircle className="animate-spin" size={24} />
          </div>
        )}
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          className="max-h-[calc(100vh-280px)]"
          keepSelection={true}
        >
          {tempFiles?.[0] && (
            <img
              src={URL.createObjectURL(tempFiles[0])}
              alt=""
              ref={imageRef}
              className="w-full h-full"
            />
          )}
        </ReactCrop>
      </div>
    </DialogModal>
  );
};
