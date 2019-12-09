import React from "react";
import { TextArea } from "../../components/input";
import { SettingOptions } from "../../../../types/globalTypes";
import { getOptions_settings } from "../../../shared/queries/types/getOptions";

interface ICssProps {
  updateOption: (option: SettingOptions, value: string) => void;
  data: { [option in SettingOptions]: getOptions_settings };
  label: string;
}

const CustomCSS: React.FC<ICssProps> = ({ updateOption, data }) => {
  return (
    <div>
      <TextArea
        rows={7}
        defaultValue={data.css.value || ""}
        placeholder="Additional CSS"
        onChange={e => updateOption(SettingOptions.css, e.target.value)}
      />
    </div>
  );
};

export default CustomCSS;
