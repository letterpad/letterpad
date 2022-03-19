import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Collapse, Form, Input } from "antd";
const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

interface Props {
  settings: Setting;
  updateSettings: () => void;
  cloudinaryEnabledByAdmin: boolean;
  onChange: (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => void;
}
const Integrations: React.FC<Props> = ({
  settings,
  updateSettings,
  onChange,
  cloudinaryEnabledByAdmin,
}) => {
  return (
    <Collapse>
      <Panel header="Integrations" key="1">
        <p>
          {cloudinaryEnabledByAdmin &&
            "Cloudinary helps in optimising all your images and are served by a CDN. This has already been enabled by Admin."}
        </p>
        <br />
        <Form.Item label="Cloudinary Name">
          <Input
            size="middle"
            disabled={cloudinaryEnabledByAdmin}
            value={settings.cloudinary_name}
            onBlur={updateSettings}
            onChange={(e) => onChange("cloudinary_name", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Cloudinary Key">
          <Input
            disabled={cloudinaryEnabledByAdmin}
            size="middle"
            value={settings.cloudinary_key}
            onBlur={updateSettings}
            onChange={(e) => onChange("cloudinary_key", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Cloudinary Secret">
          <Input
            disabled={cloudinaryEnabledByAdmin}
            size="middle"
            value={settings.cloudinary_secret}
            onBlur={updateSettings}
            onChange={(e) => onChange("cloudinary_secret", e.target.value)}
          />
        </Form.Item>
      </Panel>
    </Collapse>
  );
};
export default Integrations;
