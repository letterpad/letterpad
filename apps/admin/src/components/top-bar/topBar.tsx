import { CgClose } from "react-icons/cg";
import { HiOutlineMenu } from "react-icons/hi";
import { Button, useResponsiveLayout } from "ui";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

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
          <Button
            className="menu"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            {sidebarVisible ? <CgClose /> : <HiOutlineMenu />}
          </Button>
        )}
      </div>
      {SavingIndicator}
      <div className="flex flex-row gap-2">
        <Button size="small" variant="ghost">
          <a
            href="https://docs.letterpad.app/"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </a>
        </Button>
        <FeedbackForm />
        <ThemeSwitcher />
      </div>
    </div>
  );
};
