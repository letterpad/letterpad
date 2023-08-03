import { Controller, useFormContext } from "react-hook-form";
import { Button, Input, Label, TextArea } from "ui";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
interface Props {
  cloudinaryEnabledByAdmin: boolean;
}
const Integrations: React.FC<Props> = ({ cloudinaryEnabledByAdmin }) => {
  const data = useFormContext();
  return (
    <>
      <div className="mb-4">
        <Label label="Cloudinary" className="mb-4 text-md font-bold" />
        <p className="dark:text-gray-400">
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
            {...data.register("cloudinary_name")}
          />

          <Input
            label="Cloudinary Key"
            placeholder="Enter cloudinary key"
            disabled={cloudinaryEnabledByAdmin}
            data-testid="cKey"
            {...data.register("cloudinary_key")}
          />

          <Input
            label="Cloudinary Secret"
            placeholder="Enter cloudinary secret"
            disabled={cloudinaryEnabledByAdmin}
            data-testid="cSecret"
            {...data.register("cloudinary_secret")}
          />
        </div>
        <div>
          <Label label="Add Scripts" className="mb-4 text-md font-bold" />
          <p className="mb-4 dark:text-gray-400">
            <span>
              You can add scripts to your website. This can be used to add
              analytics, monitoring, alerts, etc.
            </span>
          </p>

          <Controller
            name="scripts"
            control={data.control}
            render={({ field: { onChange } }) => (
              <TextArea
                onChange={onChange}
                value={data?.watch("scripts") ?? ""}
              />
            )}
          />
        </div>
      </div>
      <Button type="submit" data-testid="save-integrations">
        Save
      </Button>
    </>
  );
};
export default Integrations;
