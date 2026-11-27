"use client";

import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useResponsiveLayout } from "ui/dist/index.mjs";

import "tippy.js/dist/tippy.css";
import "./workspace.css";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import { workspaceFonts } from "../fonts/fonts";
import Footer from "../website_v2/Footer";

export const TwoColumnLayout = ({ children }) => {
  const { sidebarVisible, setSidebarVisible, isDesktop } =
    useResponsiveLayout();
  const sidebar = useRef<HTMLElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (main.current) main.current.inert = sidebarVisible && !isDesktop;
  }, [isDesktop, sidebarVisible]);

  const closeSidebar = () => {
    if (main.current) main.current.inert = false;
    setSidebarVisible(false);
    toggle.current?.focus();
  };

  const toggleSidebar = () => {
    if (sidebarVisible) {
      closeSidebar();
      return;
    }

    setSidebarVisible(true);
    if (!isDesktop) {
      requestAnimationFrame(() => sidebar.current?.focus());
    }
  };

  return (
    <div
      className={classNames(
        "admin-workspace",
        workspaceFonts.sans.variable,
        workspaceFonts.serif.variable
      )}
      data-sidebar-open={sidebarVisible}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" &&
          sidebarVisible &&
          !isDesktop &&
          !event.defaultPrevented
        ) {
          closeSidebar();
        }
      }}
    >
      <aside
        id="workspace-sidebar"
        className="workspace-sidebar"
        ref={sidebar}
        tabIndex={-1}
      >
        <Sidebar onNavigate={isDesktop ? undefined : closeSidebar} />
      </aside>
      <button
        type="button"
        className="workspace-backdrop"
        aria-label="Close navigation"
        tabIndex={-1}
        onClick={closeSidebar}
      />
      <div className="workspace-main" ref={main}>
        <TopBar
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
          toggleRef={toggle}
        />
        <main className="workspace-content">{children}</main>
        <div className="workspace-footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};
