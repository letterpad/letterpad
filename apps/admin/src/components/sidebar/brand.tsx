import { FC } from "react";

import { Logo } from "../../app/(public)/login/_feature";

interface Props {
  site_name: string;
}

export const Brand: FC<Props> = () => (
  <div className="sidebar-header flex items-center">
    <div className="inline-flex">
      <a href="/" className="inline-flex flex-row items-center">
        <Logo width={140} isDarkBg={true} />
      </a>
    </div>
  </div>
);
