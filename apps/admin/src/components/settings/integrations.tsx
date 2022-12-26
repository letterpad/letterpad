import { useState } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";

import { SettingInputType } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
const Integrations: React.FC<Props> = ({
  settings,
  cloudinaryEnabledByAdmin,
}) => {
  const [fields, setFields] = useState<SettingInputType>({
    cloudinary_name: settings.cloudinary_name,
    cloudinary_key: settings.cloudinary_key,
    cloudinary_secret: settings.cloudinary_secret,
  });
  const { updateSettingsAPI } = useUpdateSettings();

  const onChange = (e, field: keyof SettingInputType) => {
    setFields({ ...fields, [field]: e.target.value });
  };
  return (
    <>
      <p className="dark:text-gray-300">
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
      <div className="mb-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        <Input
          label="Cloudinary Name"
          placeholder="Enter cloudinary name"
          data-testid="cName"
          disabled={cloudinaryEnabledByAdmin}
          value={fields.cloudinary_name}
          onChange={(e) => {
            onChange(e, "cloudinary_name");
          }}
        />

        <Input
          label="Cloudinary Key"
          placeholder="Enter cloudinary key"
          disabled={cloudinaryEnabledByAdmin}
          data-testid="cKey"
          value={fields.cloudinary_key}
          onChange={(e) => {
            onChange(e, "cloudinary_key");
          }}
        />

        <Input
          label="Cloudinary Secret"
          placeholder="Enter cloudinary secret"
          disabled={cloudinaryEnabledByAdmin}
          data-testid="cSecret"
          value={fields.cloudinary_secret}
          onChange={(e) => {
            onChange(e, "cloudinary_secret");
          }}
        />
      </div>
      <Buttonv2
        onClick={() => updateSettingsAPI(fields)}
        data-testid="save-integrations"
      >
        Save
      </Buttonv2>
    </>
  );
};
export default Integrations;
