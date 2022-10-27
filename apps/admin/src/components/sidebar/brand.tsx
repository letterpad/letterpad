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
        <span className="ml-1 text-xl font-bold uppercase leading-10 text-gray-200">
          Letterpad
        </span>
      </a>
    </div>
  </div>
);
