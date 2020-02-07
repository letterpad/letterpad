import React, { useEffect, useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { WithNamespaces, translate } from "react-i18next";

import Button from "../../components/button";
import Css from "./Css";
import General from "./General";
import Messages from "./Messages";
import Optional from "./Optional";
import { RouteComponentProps } from "react-router";
import Social from "./Social";
import StyledSection from "../../components/section";
import StyledTitleHeader from "../../components/title-header";
import Tabs from "../../components/tabs";
import Themes from "./Themes";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";
import apolloClient from "../../../shared/apolloClient";
import { notify } from "react-notify-toast";
import utils from "../../../shared/util";

interface ISettingsProps extends WithNamespaces {
  router: RouteComponentProps;
  settings: { [option in SettingOptions]: Setting };
}

// type that the internal state accepts
type TypeUpdatedOptions = { [option in keyof typeof SettingOptions]?: string };

// Type that the api expects
type TypeAPIUpdatedOptions = { option: string; value: string };

const Settings: React.FC<ISettingsProps> = ({ router, settings, t }) => {
  const urlParams = new URLSearchParams(router.history.location.search);
  const [updatedOptions, setUpdatedOptions] = useState<TypeUpdatedOptions>({});
  const [selectedTab] = useState<string>(urlParams.get("tab") || "general");

  useEffect(() => {
    if (Object.keys(updatedOptions).length > 0) {
      utils.debounce(submitData, 500)();
    }
  }, [updatedOptions]);

  const setOption = (option: SettingOptions, value: string) => {
    const key = SettingOptions[getSettingsKey(option)];
    if (settings[key].value === value) return;
    const newUpdates = { ...updatedOptions, [option]: value };
    setUpdatedOptions(newUpdates);
  };

  const handleTabChange = (page: string) => {
    router.history.push({
      pathname: router.history.location.pathname,
      search: "?tab=" + page,
    });
  };

  const submitData = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const settings: TypeAPIUpdatedOptions[] = [];
    Object.keys(updatedOptions).forEach(option => {
      settings.push({
        option: option,
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

function getSettingsKey(key: string) {
  for (let enumMember in SettingOptions) {
    const isValueProperty = SettingOptions[enumMember];
    if (isValueProperty === key) {
      return enumMember;
    }
  }
}
