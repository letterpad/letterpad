import React, { useEffect, useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import StyledSection, { SectionSizes } from "../../components/section";
import { WithNamespaces, translate } from "react-i18next";

import Css from "./Css";
import General from "./General";
import ImagesCdn from "./ImagesCdn";
import Messages from "./Messages";
import Optional from "./Optional";
import { RouteComponentProps } from "react-router";
import Social from "./Social";
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
    const newUpdates = { ...updatedOptions, [option]: value };
    setUpdatedOptions(newUpdates);
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
    <StyledSection
      title="Sitewide Settings"
      subtitle="Here you can configure your overall site."
      size={SectionSizes.md}
    >
      <Tabs defaultTab="general">
        <StyledTitleHeader
          title={t(`settings.${selectedTab}.title`)}
          subtitle={t(`settings.${selectedTab}.tagline`)}
        />

        <General label="general" data={settings} updateOption={setOption} />
        <Social label="social" data={settings} updateOption={setOption} />
        <Optional label="optional" data={settings} updateOption={setOption} />
        <ImagesCdn
          label="cloudinary"
          data={settings}
          updateOption={setOption}
        />
        <Themes label="themes" data={settings} updateOption={setOption} />
        <Css label="styling" data={settings} updateOption={setOption} />
        <Messages label="messages" data={settings} updateOption={setOption} />
        <br />
        <br />
      </Tabs>
    </StyledSection>
  );
};

export default translate("translations")(Settings);
