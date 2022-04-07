import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { Collapse, Divider, Form, Input } from "antd";
const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
const Integrations: React.FC<Props> = ({
  settings,
  cloudinaryEnabledByAdmin,
}) => {
  const { debounceUpdateSettings } = useUpdateSettings();
  const { ...analytics } = settings.analytics;
  delete analytics.__typename;
  return (
    <>
      <Collapse>
        <Panel header="Integrations" key="1" className="integrations">
          <p>
            {cloudinaryEnabledByAdmin && (
              <span>
                Cloudinary helps in optimising all your images and are served by
                a CDN. <u>This has already been enabled by Admin.</u>
              </span>
            )}
          </p>
          <br />
          <Form.Item label="Cloudinary Name">
            <Input
              size="middle"
              data-testid="cName"
              disabled={cloudinaryEnabledByAdmin}
              value={settings.cloudinary_name}
              onChange={(e) =>
                debounceUpdateSettings({ cloudinary_name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Cloudinary Key">
            <Input
              disabled={cloudinaryEnabledByAdmin}
              data-testid="cKey"
              size="middle"
              value={settings.cloudinary_key}
              onChange={(e) =>
                debounceUpdateSettings({ cloudinary_key: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Cloudinary Secret">
            <Input
              disabled={cloudinaryEnabledByAdmin}
              size="middle"
              data-testid="cSecret"
              value={settings.cloudinary_secret}
              onChange={(e) =>
                debounceUpdateSettings({ cloudinary_secret: e.target.value })
              }
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
              data-testid="gA"
              value={settings.analytics?.google_analytics}
              onChange={(e) =>
                debounceUpdateSettings({
                  analytics: {
                    ...analytics,
                    google_analytics: e.target.value,
                  },
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
                  ...analytics,
                  simple_analytics: e.target.value,
                })
              }
            />
          </Form.Item> */}
          <Form.Item label="Plausible Analytics">
            <Input
              placeholder="e.g. demo.letterpad.app"
              size="middle"
              data-testid="plausible"
              value={settings.analytics?.plausible_data_domain}
              onChange={(e) =>
                debounceUpdateSettings({
                  analytics: {
                    ...analytics,
                    plausible_data_domain: e.target.value,
                  },
                })
              }
            />
          </Form.Item>
          <Form.Item label="Umami Analytics Id">
            <Input
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              size="middle"
              value={settings.analytics?.umami_id}
              data-testid="umai"
              onChange={(e) =>
                debounceUpdateSettings({
                  analytics: {
                    ...analytics,
                    umami_id: e.target.value,
                  },
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
