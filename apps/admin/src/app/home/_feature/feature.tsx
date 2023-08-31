"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { EventAction, track } from "@/track";

import { GettingStarted } from "./components/getting-started";
import { useGetAuthor } from "../../profile/_feature/api.client";
import {
  useGetSettings,
  useUpdateSettings,
} from "../../settings/_feature/api.client";

export const Feature = () => {
  const { data: author } = useGetAuthor();
  const router = useRouter();
  const { data: settings } = useGetSettings();
  const { updateSettings } = useUpdateSettings();

  const onDismiss = useCallback(() => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "onboarding",
      eventLabel: "completed",
    });
    updateSettings({ options: { intro_dismissed: true } });
    router.push("/posts");
  }, [updateSettings, router]);

  const username = author?.username || "";
  const changeUsername =
    parseInt(username).toString() == username && username.match(/^[0-9]+$/);

  const showGettingStarted =
    changeUsername ||
    !author?.profile_updated ||
    !author?.first_post_published ||
    !author.settings_updated;

  useEffect(() => {
    if (!showGettingStarted) onDismiss();
  }, [showGettingStarted, onDismiss]);

  if (!author || !settings) return null;

  if (showGettingStarted) {
    return withDismiss(
      <GettingStarted author={author} settings={settings} />,
      onDismiss
    );
  }
  return withDismiss(null, onDismiss);
};

const withDismiss = (children: React.ReactNode, onDismiss) => {
  return (
    <>
      <button
        onClick={onDismiss}
        style={{ height: 10, width: 10, opacity: 0 }}
        data-testid="dismissIntro"
      >
        -
      </button>
      {children}
    </>
  );
};
