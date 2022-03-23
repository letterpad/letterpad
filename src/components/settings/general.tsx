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
const General: React.FC<Props> = ({ settings, updateSettings, onChange }) => {
  return (
    <Collapse>
      <Panel header="General Settings" key="1">
        <Form.Item label="Site Title">
          <Input
            size="middle"
            value={settings.site_title}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_title", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Site Tagline">
          <Input
            size="middle"
            value={settings.site_tagline}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_tagline", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Site Email">
          <Input
            size="middle"
            value={settings.site_email}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_email", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Short Description">
          <Input
            size="middle"
            value={settings.site_description}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_description", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Site Url" hidden={true}>
          <Input
            size="middle"
            value={settings.site_url}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_url", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Footer Description">
          <Input
            size="middle"
            value={settings.site_footer}
            onBlur={updateSettings}
            onChange={(e) => onChange("site_footer", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Google Analytics">
          <Input
            size="middle"
            value={settings.google_analytics}
            onBlur={updateSettings}
            onChange={(e) => onChange("google_analytics", e.target.value)}
          />
        </Form.Item>
      </Panel>
    </Collapse>
  );
};
export default General;
