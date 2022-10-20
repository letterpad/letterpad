import { Form, Radio, Space } from "antd";
import highlight from "highlight.js";
import hljs from "highlight.js/lib/core";
import hljsCssLang from "highlight.js/lib/languages/css";
import Editor from "react-simple-code-editor";

import ImageUpload from "../ImageUpload";
hljs.registerLanguage("css", hljsCssLang);
import { useMemo, useRef } from "react";

import "highlight.js/styles/night-owl.css";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

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
    <>
      <Form.Item label="Logo">
        <ImageUpload
          name="Logo"
          url={settings?.site_logo?.src}
          onDone={([res]) =>
            updateSettings({
              site_logo: {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Favicon">
        <ImageUpload
          name="Favicon"
          url={settings?.site_favicon?.src}
          onDone={([res]) =>
            updateSettings({
              site_favicon: {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Banner">
        <ImageUpload
          name="Banner"
          url={settings?.banner?.src}
          onDone={([res]) =>
            updateSettings({
              banner: {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              },
            })
          }
        />
        <small>
          (Banner may or may not be displayed, depending on the theme)
        </small>
      </Form.Item>
      <Form.Item label="Layout">
        <Radio.Group
          onChange={(e) => updateSettings({ theme: e.target.value })}
          defaultValue="a"
          size="middle"
          value={settings.theme}
        >
          <Space direction="vertical">
            <Radio value="minimal">Minimal</Radio>
            <Radio value="magazine">Magazine</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="CSS">
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
      </Form.Item>
    </>
  );
};
export default Appearance;
