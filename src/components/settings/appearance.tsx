import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Collapse, Form, Radio, Space } from "antd";
import ImageUpload from "../ImageUpload";
import Editor from "react-simple-code-editor";

import highlight from "highlight.js";
import hljs from "highlight.js/lib/core";
import hljsCssLang from "highlight.js/lib/languages/css";
hljs.registerLanguage("css", hljsCssLang);
import "highlight.js/styles/night-owl.css";
import { useRef } from "react";

const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

interface Props {
  settings: Setting;
  onChange: (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => void;
}
const Appearance: React.FC<Props> = ({ settings, onChange }) => {
  const editorRef = useRef<any>(null);
  console.log(settings.theme);
  return (
    <Collapse>
      <Panel header="Appearance" key="1">
        <Form.Item label="Logo">
          <ImageUpload
            name="Logo"
            url={settings?.site_logo?.src}
            onDone={([res]) =>
              onChange("site_logo", {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              })
            }
          />
        </Form.Item>
        <Form.Item label="Favicon">
          <ImageUpload
            name="Favicon"
            url={settings?.site_favicon?.src}
            onDone={([res]) =>
              onChange("site_favicon", {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              })
            }
          />
        </Form.Item>
        <Form.Item label="Banner">
          <ImageUpload
            name="Banner"
            url={settings?.banner?.src}
            onDone={([res]) =>
              onChange("banner", {
                src: res.src,
                width: res.size.width,
                height: res.size.height,
              })
            }
          />
          <small>
            (Banner may or may not be displayed, depending on the theme)
          </small>
        </Form.Item>
        <Form.Item label="Layout">
          <Radio.Group
            onChange={(e) => onChange("theme", e.target.value)}
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
                onChange("css", code);
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
              @media (max-width: 967px) {
                width: 70vw;
              }

              pre,
              .hljs {
                overflow-y: scroll;
              }
            }
          `}</style>
        </Form.Item>
      </Panel>
    </Collapse>
  );
};
export default Appearance;
