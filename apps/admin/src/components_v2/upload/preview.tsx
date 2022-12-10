import classNames from "classnames";
import { FC } from "react";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineLoading3Quarters,
  AiOutlinePlus,
} from "react-icons/ai";

interface NoImage {
  src: string;
}
interface Props {
  url: string;
  onRemove: (args: NoImage[]) => void;
  loading?: boolean;
}

export const Preview: FC<Props> = ({ url, onRemove, loading }) => {
  return (
    <div className="group relative h-full w-full bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600">
      {loading ? (
        <Loading />
      ) : (
        <>
          <RemoveImage url={url} onRemove={onRemove} />
          <AddImage url={url} onRemove={onRemove} />
        </>
      )}
      {url && (
        <img src={url} alt="Image" className="h-full w-full object-cover" />
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2",
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

const AddImage: FC<Props> = ({ url }) => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2",
        {
          hidden: url,
        },
      )}
    >
      <AiOutlinePlus size={24} />
    </div>
  );
};

const RemoveImage: FC<Props> = ({ url, onRemove }) => {
  return (
    <div
      className={classNames(
        "absolute top-1/2 left-1/2  hidden -translate-x-1/2 -translate-y-1/2 gap-2",
        {
          "group-hover:flex": url,
        },
      )}
    >
      <AiOutlineEye />
      <AiOutlineDelete onClick={() => onRemove([{ src: "" }])} />
    </div>
  );
};
