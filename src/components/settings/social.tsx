import { Collapse, Form, Input } from "antd";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
}
const Social: React.FC<Props> = ({ settings }) => {
  const { debounceUpdateSettings } = useUpdateSettings();
  return (
    <Collapse>
      <Panel header="Social  Settings" key="1">
        <Form.Item label="Twitter">
          <Input
            size="middle"
            value={settings.social_twitter}
            onChange={(e) =>
              debounceUpdateSettings({ social_twitter: e.target.value })
            }
            placeholder="eg. https://twitter.com/username"
          />
        </Form.Item>
        <Form.Item label="Facebook">
          <Input
            size="middle"
            value={settings.social_facebook}
            onChange={(e) =>
              debounceUpdateSettings({ social_facebook: e.target.value })
            }
            placeholder="eg. https://www.facebook.com/username"
          />
        </Form.Item>
        <Form.Item label="Instagram">
          <Input
            size="middle"
            value={settings.social_instagram}
            onChange={(e) =>
              debounceUpdateSettings({ social_instagram: e.target.value })
            }
            placeholder="eg. https://instagram.com/username"
          />
        </Form.Item>
        <Form.Item label="Github">
          <Input
            size="middle"
            value={settings.social_github}
            onChange={(e) =>
              debounceUpdateSettings({ social_github: e.target.value })
            }
            placeholder="eg. https://github.com/abhisaha1"
          />
        </Form.Item>
      </Panel>
    </Collapse>
  );
};
export default Social;
