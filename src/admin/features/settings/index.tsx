import React, { useState } from "react";
import { notify } from "react-notify-toast";
import { translate, WithNamespaces } from "react-i18next";

import General from "./General";
import Social from "./Social";
import Optional from "./Optional";
import Messages from "./Messages";

import StyledSection from "../../components/section";
import StyledTitleHeader from "../../components/title-header";
import Button from "../../components/button";
import Tabs from "../../components/tabs";

import Themes from "./Themes";
import Css from "./Css";
import { RouteComponentProps } from "react-router";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import apolloClient from "../../../shared/apolloClient";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";

interface ISettingsProps extends WithNamespaces {
  router: RouteComponentProps;
  settings: { [option in SettingOptions]: Setting };
}

// type that the internal state accepts
type TypeUpdatedOptions = { [option in keyof typeof SettingOptions]?: string };

// Type that the api expects
type TypeAPIUpdatedOptions = { option: SettingOptions; value: string };

const Settings: React.FC<ISettingsProps> = ({ router, settings, t }) => {
  const urlParams = new URLSearchParams(router.history.location.search);
  const [updatedOptions, setUpdatedOptions] = useState<TypeUpdatedOptions>({});
  const [selectedTab] = useState<string>(urlParams.get("tab") || "general");

  const setOption = (option: SettingOptions, value: string) => {
    const newUpdates = { ...updatedOptions, [option]: value };
    setUpdatedOptions(newUpdates);
  };

  const handleTabChange = (page: string) => {
    router.history.push({
      pathname: router.history.location.pathname,
      search: "?tab=" + page,
    });
  };

  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();
    const settings: TypeAPIUpdatedOptions[] = [];
    Object.keys(updatedOptions).forEach(option => {
      settings.push({
        option: SettingOptions[option],
        value: updatedOptions[option],
      });
    });
    await apolloClient(true).mutate({
      mutation: UPDATE_OPTIONS,
      variables: {
        options: settings,
      },
    });
    notify.show("Site settings saved", "success", 3000);
  };

  return (
    <StyledSection>
      <Tabs activeTab={selectedTab} onChange={handleTabChange}>
        <StyledTitleHeader
          title={t(`settings.${selectedTab}.title`)}
          subtitle={t(`settings.${selectedTab}.tagline`)}
        />

        <General label="general" data={settings} updateOption={setOption} />
        <Social label="social" data={settings} updateOption={setOption} />
        <Optional label="optional" data={settings} updateOption={setOption} />
        <Themes label="themes" data={settings} updateOption={setOption} />
        <Css label="css" data={settings} updateOption={setOption} />
        <Messages label="messages" data={settings} updateOption={setOption} />
        <br />
        <br />
        <Button success onClick={submitData}>
          Save
        </Button>
      </Tabs>
    </StyledSection>
  );
};

export default translate("translations")(Settings);
