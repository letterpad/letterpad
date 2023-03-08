import { useMemo } from "react";
import { Button, Label, RadioGroup, TextArea } from "ui";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Upload } from "@/components/upload";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce, removeTypenames } from "@/shared/utils";

interface Props {
  settings: SettingsFragmentFragment;
}
const Appearance: React.FC<Props> = ({ settings }) => {
  const { updateSettings, updateLocalState, updateSettingsAPI } =
    useUpdateSettings();

  const debounceUpdateSettingsAPI = useMemo(
    () => debounce((data) => updateSettingsAPI(data), 500),
    [updateSettingsAPI]
  );
  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4">
        <Label label="Brand Color - Choose a color that reflects your brand." />
        <div className="flex flex-row items-center gap-2">
          <input
            type="color"
            className="h-20 w-32"
            value={settings?.design?.brand_color ?? "#d93097"}
            onChange={(e) =>
              updateSettings({
                design: {
                  ...removeTypenames(settings.design),
                  brand_color: e.target.value,
                },
              })
            }
          />
          <Button onClick={() => window.open(settings.site_url, "_blank")}>
            Preview
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <Upload
          label="Logo"
          className="h-28 w-28"
          url={settings?.site_logo?.src ?? ""}
          onSuccess={([res]) => {
            updateSettings({
              site_logo: {
                src: res.src,
                width: res.size?.width,
                height: res.size?.height,
              },
            });
          }}
        />
        <Upload
          label="Favicon"
          className="h-28 w-28"
          url={settings?.site_favicon?.src ?? ""}
          onSuccess={([res]) => {
            updateSettings({
              site_favicon: {
                src: res.src,
                width: res.size?.width,
                height: res.size?.height,
              },
            });
          }}
        />
        <Upload
          label="Banner"
          className="h-28 w-28"
          url={settings?.banner?.src ?? ""}
          onSuccess={([res]) => {
            updateSettings({
              banner: {
                src: res.src,
                width: res.size?.width,
                height: res.size?.height,
              },
            });
          }}
        />
      </div>

      <div>
        <TextArea
          label="CSS"
          defaultValue={settings.css ?? ""}
          onBlur={(e) => {
            debounceUpdateSettingsAPI({ css: e.target.value });
            updateLocalState({ css: e.target.value });
          }}
          placeholder="Add css to customise your website"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 13,
            minHeight: 200,
          }}
        />
        <br />
        <Button onClick={() => debounceUpdateSettingsAPI({})}>Save</Button>
      </div>
    </div>
  );
};
export default Appearance;
