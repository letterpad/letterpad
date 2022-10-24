import React from "react";

import { useErrorReporting } from "@/hooks/useErrorReporting";
import { useLetterpadSession } from "@/hooks/useLetterpadSession";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { SessionData } from "@/graphql/types";

import ThemeSwitcher from "../theme-switcher";

interface IProps {
  render: ({
    settings,
    session,
  }: {
    settings?: SettingsFragmentFragment;
    session?: SessionData;
  }) => React.ReactNode;
}

const AuthenticatedNoLayout = ({ render }: IProps) => {
  const { data, loading } = useSettingsQuery();
  const session = useLetterpadSession();
  useErrorReporting(session?.user);

  React.useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
  }, []);

  if (!session) return null;
  if (loading) return null;
  if (data?.settings.__typename !== "Setting") return null;

  const { settings } = data;

  return <div>{render({ settings, session: session.user })}</div>;
};

export const NoLayout = ({ render }: IProps) => {
  React.useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
  }, []);

  return <div>{render({})}</div>;
};

export default AuthenticatedNoLayout;
