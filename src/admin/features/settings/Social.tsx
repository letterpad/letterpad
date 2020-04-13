import { WithNamespaces, translate } from "react-i18next";

import Input from "../../components/input";
import React from "react";
import { Setting } from "../../../__generated__/gqlTypes";
import { UpdateSettingOption } from "../../../types/types";

interface ISocialProps extends WithNamespaces {
  data: Setting;
  updateOption: (setting: UpdateSettingOption) => void;
  label?: string;
}
const Social: React.FC<ISocialProps> = ({ t, data, updateOption }) => {
  return (
    <div>
      <Input
        label={t("common.github")}
        defaultValue={data.social_github}
        type="text"
        placeholder={t("social.gh.placeholder")}
        onBlur={e => updateOption({ social_github: e.target.value })}
      />

      <Input
        label={t("common.facebook")}
        defaultValue={data.social_facebook}
        type="text"
        placeholder={t("social.fb.placeholder")}
        aria-invalid="false"
        onBlur={e => updateOption({ social_facebook: e.target.value })}
      />

      <Input
        label={t("common.twitter")}
        defaultValue={data.social_twitter}
        type="text"
        placeholder={t("social.twitter.placeholder")}
        onBlur={e => updateOption({ social_twitter: e.target.value })}
      />

      <Input
        label={t("common.instagram")}
        defaultValue={data.social_instagram}
        type="text"
        placeholder={t("social.ig.placeholder")}
        onBlur={e => updateOption({ social_instagram: e.target.value })}
      />
    </div>
  );
};

export default translate("translations")(Social);
