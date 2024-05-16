import { FC } from "react";
import { IoSwapHorizontal } from "react-icons/io5";

import { Button } from "../../button";

interface Props {
  onClick: () => void;
}

export const Swap: FC<Props> = ({ onClick }) => {
  return (
    <div className="absolute top-52 left-1/2 z-10 -ml-5">
      <Button
        onClick={onClick}
        variant="primary"
        size="small"
        className="rounded-full p-2"
      >
        <IoSwapHorizontal size={20} />
      </Button>
    </div>
  );
};
