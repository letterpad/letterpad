import React from "react";
import { translate, WithNamespaces } from "react-i18next";

import Input from "../../components/input";
import { SettingOptions } from "../../../../types/globalTypes";
import { getOptions_settings } from "../../../shared/queries/types/getOptions";

interface IMessagesProps extends WithNamespaces {
  updateOption: (option: SettingOptions, value: string) => void;
  data: { [option in SettingOptions]: getOptions_settings };
  label: string;
}
const Messages: React.FC<IMessagesProps> = ({ t, updateOption, data }) => {
  return (
    <div>
      <Input
        label={t("settings.messages.translationNotFound")}
        defaultValue={data.text_notfound.value || ""}
        type="text"
        onBlur={e => updateOption(SettingOptions.text_notfound, e.target.value)}
      />
      <Input
        label={t("settings.messages.emptyPost")}
        defaultValue={data.text_posts_empty.value || ""}
        type="text"
        onBlur={e =>
          updateOption(SettingOptions.text_posts_empty, e.target.value)
        }
      />
    </div>
  );
};

export default translate("translations")(Messages);
