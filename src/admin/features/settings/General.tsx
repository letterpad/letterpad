import Input, { TextArea } from "../../components/input";
import React, { useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Setting } from "../../../__generated__/gqlTypes";
import StyledSelect from "../../components/select";
import StyledSwitch from "../../components/switch";
import { UpdateSettingOption } from "../../../types/types";

interface IGeneralProps extends WithNamespaces {
  data: Setting;
  updateOption: (setting: UpdateSettingOption) => void;
}

const General: React.FC<IGeneralProps> = ({ data, updateOption, t, i18n }) => {
  const { langOptions, selectedLanguage } = getLanguageOptions(data.locale);

  const switchLanguage = (value: string) => {
    const locales = {};
    Object.keys(langOptions).map(lang => {
      locales[lang] = value === lang;
    });
    updateOption({ locale: JSON.stringify(locales) });
    i18n.changeLanguage(value);
  };

  const [displayAuthor, setDisplayAuthor] = useState<boolean>(
    JSON.parse(data.displayAuthorInfo),
  );

  const changeAuthorDisplay = isSelected => {
    setDisplayAuthor(isSelected);
    updateOption({ displayAuthorInfo: JSON.stringify(isSelected) });
  };

  return (
    <div>
      <Input
        data-testid="site_title"
        label={t("settings.general.site.title")}
        defaultValue={data.site_title}
        type="text"
        placeholder={t("settings.general.site.title.placeholder")}
        onChange={e => updateOption({ site_title: e.target.value })}
      />
      <Input
        data-testid="site_tagline"
        label={t("settings.general.site.tagline")}
        defaultValue={data.site_tagline}
        type="text"
        placeholder={t("settings.general.site.tagline.placeholder")}
        onChange={e => updateOption({ site_tagline: e.target.value })}
      />
      <Input
        data-testid="site_email"
        label={t("settings.general.site.email")}
        defaultValue={data.site_email}
        type="email"
        placeholder="someone@somewhere.com"
        onChange={e => updateOption({ site_email: e.target.value })}
      />
      <TextArea
        data-testid="site_description"
        label={t("settings.general.site.description")}
        defaultValue={data.site_description}
        placeholder={t("settings.general.site.description.placeholder")}
        onChange={e => updateOption({ site_description: e.target.value })}
      />
      <Input
        data-testid="site_url"
        label={t("settings.general.site.url")}
        defaultValue={data.site_url}
        type="text"
        placeholder={t("settings.general.site.url.placeholder")}
        onChange={e => updateOption({ site_url: e.target.value })}
      />
      <TextArea
        data-testid="site_footer"
        label={t("settings.general.site.footer") + "(html allowed)"}
        defaultValue={data.site_footer}
        className="form-control"
        placeholder={t("settings.general.site.footer.placeholder")}
        onChange={e => updateOption({ site_footer: e.target.value })}
      />
      <div className="form-group">
        <StyledSwitch
          leftLabel={t("settings.additional.displayAuthor")}
          isSelected={displayAuthor}
          onChange={changeAuthorDisplay}
        />
        <br />
      </div>

      <Input
        data-testid="google_analytics"
        label={t("settings.general.site.ga")}
        defaultValue={data.google_analytics}
        type="text"
        placeholder={t("settings.general.site.ga.placeholder")}
        onChange={e => updateOption({ google_analytics: e.target.value })}
      />
      <StyledSelect
        label="Select language"
        selected={selectedLanguage}
        options={langOptions}
        onChange={switchLanguage}
      />
    </div>
  );
};

export default translate("translations")(General);

function getLanguageOptions(locale: string) {
  const parsedLangOptions = JSON.parse(locale);
  let selectedLanguage = "en";

  const langOptions = Object.keys(parsedLangOptions).map(key => {
    if (parsedLangOptions[key]) {
      selectedLanguage = key;
    }
    return {
      name: key,
      value: key,
    };
  });

  return {
    selectedLanguage,
    langOptions,
  };
}
