import React, { useState } from "react";
import { translate, WithNamespaces } from "react-i18next";

import Input from "../../components/input";

import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";

interface IOptionalProps extends WithNamespaces {
  data: { [option in SettingOptions]: Setting };
  updateOption: (option: SettingOptions, value: string) => void;
  label?: string;
}
const Optional: React.FC<IOptionalProps> = ({ t, data, updateOption }) => {
  const [displayAuthor, setDisplayAuthor] = useState<boolean>(
    JSON.parse(data.displayAuthorInfo.value),
  );

  const changeAuthorDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayAuthor(e.target.checked);
    updateOption(
      SettingOptions.DisplayAuthorInfo,
      JSON.stringify(e.target.checked),
    );
  };

  return (
    <div>
      <div className="form-group">
        <div className="switch-block">
          <label className="custom-label">
            {t("settings.additional.displayAuthor")}
          </label>
          <label className="switch">
            <input
              type="checkbox"
              onChange={changeAuthorDisplay}
              checked={displayAuthor}
            />
            <span className="slider round" />
          </label>
        </div>
      </div>

      <Input
        label={t("settings.additional.disqus")}
        defaultValue={data.disqus_id.value || ""}
        type="text"
        placeholder={t("settings.additional.disqus.placeholder")}
        onBlur={e => updateOption(SettingOptions.DisqusId, e.target.value)}
      />
    </div>
  );
};

export default translate("translations")(Optional);
