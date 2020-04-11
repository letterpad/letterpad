import Input, { TextArea } from "../../components/input";
import React, { useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { WithNamespaces, translate } from "react-i18next";

import StyledSelect from "../../components/select";
import StyledSwitch from "../../components/switch";

interface IGeneralProps extends WithNamespaces {
  data: { [option in SettingOptions]: Setting };
  updateOption: (option: SettingOptions, value: string) => void;
}

const General: React.FC<IGeneralProps> = ({ data, updateOption, t, i18n }) => {
  const { langOptions, selectedLanguage } = getLanguageOptions(
    data.locale.value,
  );

  const switchLanguage = (value: string) => {
    const locales = {};
    Object.keys(langOptions).map(lang => {
      locales[lang] = value === lang;
    });
    updateOption(SettingOptions.Locale, JSON.stringify(locales));
    i18n.changeLanguage(value);
  };

  const [displayAuthor, setDisplayAuthor] = useState<boolean>(
    JSON.parse(data.displayAuthorInfo.value),
  );

  const changeAuthorDisplay = isSelected => {
    setDisplayAuthor(isSelected);
    updateOption(SettingOptions.DisplayAuthorInfo, JSON.stringify(isSelected));
  };

  return (
    <div>
      <Input
        label={t("settings.general.site.title")}
        defaultValue={data.site_title.value}
        type="text"
        placeholder={t("settings.general.site.title.placeholder")}
        onBlur={e => updateOption(SettingOptions.SiteTitle, e.target.value)}
      />
      <Input
        label={t("settings.general.site.tagline")}
        defaultValue={data.site_tagline.value}
        type="text"
        placeholder={t("settings.general.site.tagline.placeholder")}
        onBlur={e => updateOption(SettingOptions.SiteTagline, e.target.value)}
      />
      <Input
        label={t("settings.general.site.email")}
        defaultValue={data.site_email.value}
        type="email"
        placeholder="someone@somewhere.com"
        onBlur={e => updateOption(SettingOptions.SiteEmail, e.target.value)}
      />
      <TextArea
        label={t("settings.general.site.description")}
        defaultValue={data.site_description.value}
        placeholder={t("settings.general.site.description.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.SiteDescription, e.target.value)
        }
      />
      <Input
        label={t("settings.general.site.url")}
        defaultValue={data.site_url.value}
        type="text"
        placeholder={t("settings.general.site.url.placeholder")}
        onBlur={e => updateOption(SettingOptions.SiteUrl, e.target.value)}
      />
      <TextArea
        label={t("settings.general.site.footer") + "(html allowed)"}
        defaultValue={data.site_footer.value}
        className="form-control"
        placeholder={t("settings.general.site.footer.placeholder")}
        onBlur={e => updateOption(SettingOptions.SiteFooter, e.target.value)}
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
        label={t("settings.general.site.ga")}
        defaultValue={data.google_analytics.value}
        type="text"
        placeholder={t("settings.general.site.ga.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.GoogleAnalytics, e.target.value)
        }
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
