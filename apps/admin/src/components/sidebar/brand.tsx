import { FC } from "react";

import { Logo } from "../login/views/Logo";

interface Props {
  site_name: string;
}

export const Brand: FC<Props> = ({ site_name }) => (
  <div className="sidebar-header flex items-center">
    <div className="inline-flex">
      <a href="#" className="inline-flex flex-row items-center">
        <Logo width={32} isDarkBg={true} />
      </a>
    </div>
  </div>
);
