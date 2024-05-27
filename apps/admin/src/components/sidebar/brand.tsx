import classNames from "classnames";
import { FC } from "react";
import { Logo } from "ui/dist/index.mjs";

interface Props {
  site_name: string;
  className?: string;
}

export const Brand: FC<Props> = ({ className }) => (
  <div
    className={classNames("sidebar-header flex items-center sticky", className)}
  >
    <div className="inline-flex">
      <a href="/" className="inline-flex flex-row items-center">
        <Logo width={140} isDarkBg={true} />
      </a>
    </div>
  </div>
);
