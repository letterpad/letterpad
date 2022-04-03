import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Collapse } from "antd";
import NavigationBuilder from "../navigation-builder";
const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

interface Props {
  settings: Setting;
  onChange: (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => void;
}
const Navigation: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <Collapse>
      <Panel header="Navigation" key="1" className="navigation">
        <NavigationBuilder
          menuData={settings.menu}
          updateOption={(option) => onChange("menu", option)}
        />
      </Panel>
    </Collapse>
  );
};
export default Navigation;
