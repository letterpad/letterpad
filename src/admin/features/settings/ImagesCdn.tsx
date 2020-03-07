import Input, { TextArea } from "../../components/input";
import React, { useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { WithNamespaces, translate } from "react-i18next";

interface IOptionalProps extends WithNamespaces {
  data: { [option in SettingOptions]: Setting };
  updateOption: (option: SettingOptions, value: string) => void;
  label?: string;
}
const ImagesCdn: React.FC<IOptionalProps> = ({ t, data, updateOption }) => {
  return (
    <div>
      <Input
        label={t("settings.cdn.cloud_name")}
        defaultValue={data.cloudinary_name.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloud_name.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.CloudinaryName, e.target.value)
        }
      />
      <Input
        label={t("settings.cdn.cloudinary_key")}
        defaultValue={data.cloudinary_key.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_key.placeholder")}
        onBlur={e => updateOption(SettingOptions.CloudinaryKey, e.target.value)}
      />
      <Input
        label={t("settings.cdn.cloudinary_secret")}
        defaultValue={data.cloudinary_secret.value || ""}
        type="text"
        placeholder={t("settings.cdn.cloudinary_secret.placeholder")}
        onBlur={e =>
          updateOption(SettingOptions.CloudinarySecret, e.target.value)
        }
      />
    </div>
  );
};

export default translate("translations")(ImagesCdn);
