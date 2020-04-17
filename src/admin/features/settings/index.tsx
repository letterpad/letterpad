import {
  OptionInputType,
  Setting,
  UpdateOptionsMutation,
  UpdateOptionsMutationVariables,
} from "../../../__generated__/gqlTypes";
import React, { useEffect, useState } from "react";
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
import { UpdateSettingOption } from "../../../types/types";
import apolloClient from "../../../shared/apolloClient";

interface ISettingsProps extends WithNamespaces {
  router: RouteComponentProps;
  settings: Setting;
}

let timeout;
const Settings: React.FC<ISettingsProps> = ({ router, settings, t }) => {
  const [updatedOptions, setUpdatedOptions] = useState<OptionInputType[]>([]);

  useEffect(() => {
    if (Object.keys(updatedOptions).length > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(submitData, 1000);
    }
  }, [updatedOptions]);

  const setOption = (setting: UpdateSettingOption) => {
    const newUpdates = { ...updatedOptions, ...setting };
    setUpdatedOptions(newUpdates);
  };

  const submitData = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    await apolloClient(true).mutate<
      UpdateOptionsMutation,
      UpdateOptionsMutationVariables
    >({
      mutation: UPDATE_OPTIONS,
      variables: {
        options: updatedOptions,
      },
    });
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
        <Navigation menuData={settings.menu} updateOption={setOption} />
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
    </StyledSection>
  );
};

export default translate("translations")(Settings);
