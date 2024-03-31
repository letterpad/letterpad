import classNames from "classnames";
import { CgClose } from "react-icons/cg";
import { HiOutlineMenu } from "react-icons/hi";
import { Button, ThemeSwitcher, useResponsiveLayout } from "ui";

import FeedbackForm from "./feedback-form";
import { NotificationDropdown } from "../notification-dd/list";
import { ProfileDropdown } from "../profile-dd";

export const TopBar = () => {
  const { sidebarVisible, setSidebarVisible } = useResponsiveLayout();
  return (
    <div className="flex flex-row items-center justify-between py-4">
      <div>
        <Button
          size={"extrasmall"}
          className={classNames("menu", { hidden: sidebarVisible })}
          onClick={() => setSidebarVisible(!sidebarVisible)}
          data-testid="menu-open-btn"
        >
          {sidebarVisible ? <CgClose /> : <HiOutlineMenu />}
        </Button>
      </div>
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
        <div className="px-2 flex items-center">
          <ThemeSwitcher />
        </div>
        <NotificationDropdown />
        <ProfileDropdown adminPage={true} />
      </div>
    </div>
  );
};
