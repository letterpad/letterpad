import { Form, Input } from "antd";
import { useMemo } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

interface Props {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
const Integrations: React.FC<Props> = ({
  settings,
  cloudinaryEnabledByAdmin,
}) => {
  const { updateLocalState, updateSettingsAPI } = useUpdateSettings();

  const debounceUpdateSettings = useMemo(
    () => debounce((data) => updateSettingsAPI(data), 500),
    [updateSettingsAPI],
  );
  return (
    <>
      <p>
        <span>
          Cloudinary helps in optimising all your images and are served by a
          CDN.
        </span>
        {cloudinaryEnabledByAdmin && (
          <span>
            <u>This has already been enabled by Admin.</u>
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
          onChange={(e) => {
            debounceUpdateSettings({ cloudinary_name: e.target.value });
            updateLocalState({ cloudinary_name: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Cloudinary Key">
        <Input
          disabled={cloudinaryEnabledByAdmin}
          data-testid="cKey"
          size="middle"
          value={settings.cloudinary_key}
          onChange={(e) => {
            debounceUpdateSettings({ cloudinary_key: e.target.value });
            updateLocalState({ cloudinary_key: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Cloudinary Secret">
        <Input
          disabled={cloudinaryEnabledByAdmin}
          size="middle"
          data-testid="cSecret"
          value={settings.cloudinary_secret}
          onChange={(e) => {
            debounceUpdateSettings({ cloudinary_secret: e.target.value });
            updateLocalState({ cloudinary_secret: e.target.value });
          }}
        />
      </Form.Item>
    </>
  );
};
export default Integrations;
