import React, { useEffect, useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import StyledSection, { SectionSizes } from "../../components/section";
import { WithNamespaces, translate } from "react-i18next";

import Accordion from "../../components/accordion";
import Appearance from "./Appearance";
import General from "./General";
import Integrations from "./Integrations";
import Navigation from "./Navigation";
import { RouteComponentProps } from "react-router";
import Social from "./Social";
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
  const [updatedOptions, setUpdatedOptions] = useState<TypeUpdatedOptions>({});

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
    <StyledSection title="Sitewide Settings" size={SectionSizes.md}>
      <Accordion
        title={t(`settings.general.title`)}
        subtitle={t(`settings.general.tagline`)}
        tab="general"
      >
        <General data={settings} updateOption={setOption} />
      </Accordion>
      <Accordion
        title={t(`settings.appearance.title`)}
        subtitle={t(`settings.appearance.tagline`)}
        tab="appearance"
      >
        <Appearance data={settings} updateOption={setOption} />
      </Accordion>
      <Accordion
        title={t(`settings.navigation.title`)}
        subtitle={t(`settings.navigation.tagline`)}
        tab="navigation"
      >
        <Navigation settings={settings} />
      </Accordion>
      <Accordion
        title={t(`settings.social.title`)}
        subtitle={t(`settings.social.tagline`)}
        tab="social"
      >
        <Social data={settings} updateOption={setOption} />
      </Accordion>
      <Accordion
        title={t(`settings.integrations.title`)}
        subtitle={t(`settings.integrations.tagline`)}
        tab="integrations"
      >
        <Integrations data={settings} updateOption={setOption} />
      </Accordion>
      <Accordion
        title={t(`settings.themes.title`)}
        subtitle={t(`settings.themes.tagline`)}
        tab="themes"
      >
        <Themes data={settings} updateOption={setOption} />
      </Accordion>

      {/* <Accordion
        title={t(`settings.messages.title`)}
        subtitle={t(`settings.messages.tagline`)}
        tab="messages"
      >
        <Messages data={settings} updateOption={setOption} />
      </Accordion> */}
    </StyledSection>
  );
};

export default translate("translations")(Settings);
