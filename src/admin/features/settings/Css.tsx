import React from "react";
import { TextArea } from "../../components/input";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";

interface ICssProps {
  updateOption: (option: SettingOptions, value: string) => void;
  data: { [option in SettingOptions]: Setting };
  label: string;
}

const CustomCSS: React.FC<ICssProps> = ({ updateOption, data }) => {
  return (
    <div>
      <TextArea
        rows={7}
        defaultValue={data.css.value || ""}
        placeholder="Additional CSS"
        onChange={e => updateOption(SettingOptions.Css, e.target.value)}
      />
    </div>
  );
};

export default CustomCSS;
