import { FC } from "react";

import { Button } from "@/components_v2/button";

interface Props {
  onClick: () => void;
}

export const Swap: FC<Props> = ({ onClick }) => {
  return (
    <div className="absolute top-52 left-1/2 -ml-5 z-10">
      <Button onClick={onClick} type="primary" className="rounded-full p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      </Button>
    </div>
  );
};
