import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Collapse, Form, Input } from "antd";
const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

interface Props {
  settings: Setting;
  updateSettings: () => void;
  onChange: (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => void;
}
const Social: React.FC<Props> = ({ settings, onChange, updateSettings }) => {
  return (
    <Collapse>
      <Panel header="Social  Settings" key="1">
        <Form.Item label="Twitter">
          <Input
            size="middle"
            value={settings.social_twitter}
            onBlur={updateSettings}
            onChange={(e) => onChange("social_twitter", e.target.value)}
            placeholder="eg. https://twitter.com/username"
          />
        </Form.Item>
        <Form.Item label="Facebook">
          <Input
            size="middle"
            value={settings.social_facebook}
            onBlur={updateSettings}
            onChange={(e) => onChange("social_facebook", e.target.value)}
            placeholder="eg. https://www.facebook.com/username"
          />
        </Form.Item>
        <Form.Item label="Instagram">
          <Input
            size="middle"
            value={settings.social_instagram}
            onBlur={updateSettings}
            onChange={(e) => onChange("social_instagram", e.target.value)}
            placeholder="eg. https://instagram.com/username"
          />
        </Form.Item>
        <Form.Item label="Github">
          <Input
            size="middle"
            value={settings.social_github}
            onBlur={updateSettings}
            onChange={(e) => onChange("social_github", e.target.value)}
            placeholder="eg. https://github.com/abhisaha1"
          />
        </Form.Item>
      </Panel>
    </Collapse>
  );
};
export default Social;
