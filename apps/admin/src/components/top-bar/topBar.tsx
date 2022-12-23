import { CgClose } from "react-icons/cg";
import { HiOutlineMenu } from "react-icons/hi";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

import { Buttonv2 } from "@/components_v2/button";
import { useResponsiveLayout } from "@/components_v2/layouts/responsiveProvider";

import FeedbackForm from "../feedback-form";
import ThemeSwitcher from "../theme-switcher";

export const TopBar = () => {
  const SavingIndicator = useSavingIndicator();
  const { sidebarVisible, setSidebarVisible, isMobileOrTablet } =
    useResponsiveLayout();
  return (
    <div className="flex flex-row items-center justify-between py-4">
      <div>
        {isMobileOrTablet && (
          <Buttonv2
            className="menu"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            {sidebarVisible ? <CgClose /> : <HiOutlineMenu />}
          </Buttonv2>
        )}
      </div>
      {SavingIndicator}
      <div className="flex flex-row gap-2">
        <Buttonv2 size="small" variant="ghost">
          <a
            href="https://docs.letterpad.app/"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </a>
        </Buttonv2>
        <FeedbackForm />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
