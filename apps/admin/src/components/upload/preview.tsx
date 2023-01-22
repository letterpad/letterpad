import classNames from "classnames";
import { FC, ReactNode, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineLoading3Quarters,
  AiOutlinePlus,
} from "react-icons/ai";
import { Button, Modal } from "ui";

interface NoImage {
  src: string;
  width?: number;
  height?: number;
}
interface Props {
  url: string;
  onRemove?: (args: NoImage[]) => void;
  loading?: boolean;
  openImage?: () => void;
  openFileExplorer?: () => void;
  emptyIcon?: ReactNode;
}

export const Preview: FC<Props> = ({
  url,
  onRemove,
  loading,
  openFileExplorer,
  emptyIcon,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div
      className="group relative h-full w-full rounded-md p-2"
      style={{ minHeight: 80 }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <RemoveImage
            url={url}
            onRemove={onRemove}
            openImage={() => setShow(true)}
          />
          <AddImage
            url={url}
            openFileExplorer={openFileExplorer}
            emptyIcon={emptyIcon}
          />
        </>
      )}
      {url && (
        <img src={url} alt="Image" className="h-full w-full object-cover" />
      )}
      <Modal
        toggle={setShow}
        show={show}
        header="Preview"
        size="lg"
        footer={[
          <Button
            key="close"
            variant="primary"
            onClick={() => setShow(false)}
            size="normal"
          >
            Close
          </Button>,
        ]}
      >
        <div className="flex justify-center">
          <img src={url} style={{ maxHeight: "70vh" }} alt="Profile Image" />
        </div>
      </Modal>
    </div>
  );
};

const Loading = () => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2"
      )}
    >
      <AiOutlineLoading3Quarters
        size={24}
        className="animate-spin"
        strokeWidth={10}
      />
    </div>
  );
};

const AddImage: FC<Props> = ({ url, openFileExplorer, emptyIcon }) => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2 flex h-12 flex-1 -translate-x-1/2 -translate-y-1/2 items-center gap-2",
        {
          hidden: url,
        }
      )}
      onClick={openFileExplorer}
    >
      {emptyIcon ?? <AiOutlinePlus size={24} />}
    </div>
  );
};

const RemoveImage: FC<Props> = ({ url, onRemove, openImage }) => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2  hidden -translate-x-1/2 -translate-y-1/2 gap-2",
        {
          "group-hover:flex": url,
        }
      )}
    >
      <div className="flex gap-2 rounded-md bg-white p-2">
        <AiOutlineEye onClick={() => openImage!()} />
        <AiOutlineDelete onClick={() => onRemove?.([{ src: "" }])} />
      </div>
    </div>
  );
};
