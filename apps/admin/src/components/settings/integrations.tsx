import { useState } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Buttonv2 } from "@/components_v2/button";
import { Input, Label } from "@/components_v2/input";
import { TextArea } from "@/components_v2/textarea";

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
    scripts: settings.scripts,
  });
  const { updateSettingsAPI } = useUpdateSettings();

  const onChange = (e, field: keyof SettingInputType) => {
    setFields({ ...fields, [field]: e.target.value });
  };
  return (
    <>
      <div className="mb-4">
        <Label label="Cloudinary" className="mb-4 text-md font-bold" />
        <p className="dark:text-gray-300">
          <span>
            Cloudinary helps in optimising all your images and are served by a
            CDN.
          </span>
          {cloudinaryEnabledByAdmin && (
            <span className="ml-1 font-bold">
              This has already been enabled by Admin.
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
        <div>
          <Label label="Add Scripts" className="mb-4 text-md font-bold" />
          <p className="mb-4 dark:text-gray-300">
            <span>
              You can add scripts to your website. This can be used to add
              analytics, monitoring, alerts, etc.
            </span>
          </p>
          <TextArea
            value={fields.scripts}
            onChange={(e) => onChange(e, "scripts")}
          />
        </div>
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
