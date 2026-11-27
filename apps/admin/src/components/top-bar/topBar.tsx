import { RefObject } from "react";
import { FiExternalLink, FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "ui/dist/index.mjs";

import FeedbackForm from "./feedback-form";
import { NotificationDropdown } from "../notification-dd/list";
import { ProfileDropdown } from "../profile-dd";

interface Props {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  toggleRef: RefObject<HTMLButtonElement>;
}

export const TopBar = ({ sidebarVisible, toggleSidebar, toggleRef }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const themeLabel = dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <header className="workspace-topbar">
      <button
        ref={toggleRef}
        type="button"
        className="workspace-icon-button"
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Close navigation" : "Open navigation"}
        aria-expanded={sidebarVisible}
        aria-controls="workspace-sidebar"
        data-testid="menu-open-btn"
      >
        <FiMenu aria-hidden="true" />
      </button>
      <div className="workspace-tools">
        <a
          href="https://docs.letterpad.app/"
          target="_blank"
          rel="noreferrer"
          className="workspace-help"
        >
          Help <FiExternalLink aria-hidden="true" />
        </a>
        <FeedbackForm />
        <div className="workspace-utility-group">
          <button
            type="button"
            className="workspace-icon-button"
            aria-label={themeLabel}
            title={themeLabel}
            onClick={toggleTheme}
          >
            {dark ? (
              <FiSun aria-hidden="true" />
            ) : (
              <FiMoon aria-hidden="true" />
            )}
          </button>
          <NotificationDropdown />
          <ProfileDropdown adminPage />
        </div>
      </div>
    </header>
  );
};
