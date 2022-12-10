import highlight from "highlight.js";
import hljs from "highlight.js/lib/core";
import hljsCssLang from "highlight.js/lib/languages/css";
import Editor from "react-simple-code-editor";

hljs.registerLanguage("css", hljsCssLang);
import { useMemo, useRef } from "react";

import "highlight.js/styles/night-owl.css";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Label } from "@/components_v2/input";
import { RadioGroup } from "@/components_v2/radio";
import { Upload } from "@/components_v2/upload";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

interface Props {
  settings: SettingsFragmentFragment;
}
const Appearance: React.FC<Props> = ({ settings }) => {
  const editorRef = useRef<any>(null);
  const { updateSettings, updateLocalState, updateSettingsAPI } =
    useUpdateSettings();

  const debounceUpdateSettingsAPI = useMemo(
    () => debounce((data) => updateSettingsAPI(data), 500),
    [updateSettingsAPI],
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
                width: res.size.width,
                height: res.size.height,
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
                width: res.size.width,
                height: res.size.height,
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
                width: res.size.width,
                height: res.size.height,
              },
            });
          }}
        />
      </div>
      <RadioGroup
        label="Layout Style"
        items={[
          { label: "Minimal", value: "minimal" },
          { label: "Magazine", value: "magazine" },
        ]}
        selected={settings.theme ?? "minimal"}
        onChange={(item) => updateSettings({ theme: item.value })}
      />
      <div>
        <Label label="CSS" />

        <div id="css-editor">
          <Editor
            value={settings.css ?? ""}
            onValueChange={(code) => {
              debounceUpdateSettingsAPI({ css: code });
              updateLocalState({ css: code });
            }}
            ref={editorRef}
            onChange={() => {
              editorRef.current._input.style.height =
                editorRef.current._input.parentElement.scrollHeight + "px";
            }}
            className="hljs"
            placeholder="Add css to customise your website"
            highlight={(code) => {
              return highlight.highlight(code, { language: "css" }).value;
            }}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 13,
              height: "100%",
              overflowY: "scroll",
            }}
          />
        </div>
        <style jsx>{`
          #css-editor {
            flex: 1;
            overflow: auto;
            height: 300px;
            border: 1px solid #333;
            width: 600px;
          }
          @media (max-width: 767px) {
            #css-editor {
              width: 100%;
            }
          }
          pre,
          .hljs {
            overflow-y: scroll;
          }
        `}</style>
      </div>
    </div>
  );
};
export default Appearance;
