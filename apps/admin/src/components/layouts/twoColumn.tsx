"use client";

import classNames from "classnames";
import { useCallback, useEffect, useRef } from "react";
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

  const closeSidebar = useCallback(() => {
    if (main.current) main.current.inert = false;
    setSidebarVisible(false);
    toggle.current?.focus();
  }, [setSidebarVisible]);

  useEffect(() => {
    const modalNavigation = sidebarVisible && !isDesktop;
    if (main.current) main.current.inert = modalNavigation;
    if (!modalNavigation) return;

    sidebar.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar, isDesktop, sidebarVisible]);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      closeSidebar();
    } else {
      setSidebarVisible(true);
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
