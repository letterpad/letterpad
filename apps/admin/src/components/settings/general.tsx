import { Form, Input } from "antd";
import { useMemo } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

interface Props {
  settings: SettingsFragmentFragment;
}
const General: React.FC<Props> = ({ settings }) => {
  const { updateLocalState, updateSettingsAPI, updateSettings } =
    useUpdateSettings();

  const debounceUpdateSettings = useMemo(
    () => debounce((data) => updateSettingsAPI(data), 500),
    [updateSettingsAPI],
  );
  return (
    <>
      <Form.Item label="Site Title">
        <Input
          size="middle"
          value={settings.site_title}
          onChange={(e) => {
            debounceUpdateSettings({ site_title: e.target.value });
            updateLocalState({ site_title: e.target.value });
          }}
          placeholder="Name of your blog"
          data-testid="siteTitle"
        />
      </Form.Item>
      <Form.Item label="Site Tagline">
        <Input
          size="middle"
          value={settings.site_tagline}
          onChange={(e) => {
            debounceUpdateSettings({ site_tagline: e.target.value });
            updateLocalState({ site_tagline: e.target.value });
          }}
          placeholder="A short phrase for your blog"
          data-testid="siteTagline"
        />
      </Form.Item>
      <Form.Item label="Site Email (public)">
        <Input
          size="middle"
          value={settings.site_email}
          onChange={(e) => {
            debounceUpdateSettings({ site_email: e.target.value });
            updateLocalState({ site_email: e.target.value });
          }}
          placeholder="e.g. foo@letterpad.app"
          data-testid="siteEmail"
        />
      </Form.Item>
      <Form.Item label="Short Description">
        <Input.TextArea
          size="middle"
          value={settings.site_description}
          onBlur={(e) => updateSettings({ site_description: e.target.value })}
          onChange={(e) =>
            updateLocalState({ site_description: e.target.value })
          }
          placeholder="Write something about your site. Will be used in SEO and other pages"
          autoSize={{ minRows: 3, maxRows: 3 }}
          data-testid="shortDescription"
        />
      </Form.Item>
      <Form.Item label="Site Url" hidden={true}>
        <Input
          size="middle"
          value={settings.site_url}
          onChange={(e) => updateLocalState({ site_url: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Footer Description">
        <Input.TextArea
          size="middle"
          placeholder="Anything that you want display in footer. html is allowed."
          value={settings.site_footer}
          onBlur={(e) => updateSettings({ site_footer: e.target.value })}
          onChange={(e) => updateLocalState({ site_footer: e.target.value })}
          autoSize={{ minRows: 3, maxRows: 3 }}
          maxLength={200}
          data-testid="footerDescription"
        />
      </Form.Item>
    </>
  );
};
export default General;
