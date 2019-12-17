import React from "react";
import { TextArea } from "../../components/input";
import { SettingOptions } from "../../../../types/globalTypes";
import { Setting } from "../../../__generated__/gqlTypes";

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
        onChange={e => updateOption(SettingOptions.css, e.target.value)}
      />
    </div>
  );
};

export default CustomCSS;
