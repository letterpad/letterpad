import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Collapse, Divider, Form, Input } from "antd";
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
    <>
      <Collapse>
        <Panel header="Integrations" key="1">
          <p>
            {cloudinaryEnabledByAdmin &&
              "Cloudinary helps in optimising all your images and are served by a CDN. This has already been enabled by Admin."}
          </p>
          <p>
            Cloudinary allows you to optimise and save your images in a CDN.
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
          <Divider />
          <p>
            Integrate analytics with your blog. You only need to{" "}
            <strong>
              <i>choose one of them.</i>
            </strong>
          </p>

          <br />
          <Form.Item label="Google Analytics">
            <Input
              placeholder="e.g. UA-000000-2 or G-XXXXXXX"
              size="middle"
              value={settings.analytics?.google_analytics}
              onBlur={updateSettings}
              onChange={(e) =>
                onChange("analytics", {
                  ...settings.analytics,
                  google_analytics: e.target.value,
                })
              }
            />
          </Form.Item>
          {/* <Form.Item label="Simple Analytics">
            <Input
              placeholder="e.g. demo.letterpad.app"
              size="middle"
              value={settings.analytics?.simple_analytics}
              onBlur={updateSettings}
              onChange={(e) =>
                onChange("analytics", {
                  ...settings.analytics,
                  simple_analytics: e.target.value,
                })
              }
            />
          </Form.Item> */}
          <Form.Item label="Plausible Analytics">
            <Input
              placeholder="e.g. demo.letterpad.app"
              size="middle"
              value={settings.analytics?.plausible_data_domain}
              onBlur={updateSettings}
              onChange={(e) =>
                onChange("analytics", {
                  ...settings.analytics,
                  plausible_data_domain: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Umami Analytics Id">
            <Input
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              size="middle"
              value={settings.analytics?.umami_id}
              onBlur={updateSettings}
              onChange={(e) =>
                onChange("analytics", {
                  ...settings.analytics,
                  umami_id: e.target.value,
                })
              }
            />
          </Form.Item>
        </Panel>
      </Collapse>
    </>
  );
};
export default Integrations;
