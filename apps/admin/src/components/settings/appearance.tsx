import { useMemo } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Buttonv2 } from "@/components_v2/button";
import { RadioGroup } from "@/components_v2/radio";
import { TextArea } from "@/components_v2/textarea";
import { Upload } from "@/components_v2/upload";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

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
      <RadioGroup
        label="Layout Style"
        items={[
          { label: "List", value: "minimal" },
          { label: "Grid", value: "magazine" },
        ]}
        selected={settings.theme ?? "minimal"}
        onChange={(item) => updateSettings({ theme: item.value })}
      />
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
        <Buttonv2 onClick={() => debounceUpdateSettingsAPI()}>Save</Buttonv2>
      </div>
    </div>
  );
};
export default Appearance;
