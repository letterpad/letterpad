import { SettingInputType, Setting } from "@/__generated__/__types__";
import { Checkbox, Collapse, Divider, Form, Input } from "antd";
const { Panel } = Collapse;

type ValueOf<T> = T[keyof T];

interface Props {
  settings: Setting;
  updateSettings: () => void;
  onChange: (
    key: keyof SettingInputType,
    value: ValueOf<SettingInputType>,
  ) => void;
}

const Pages: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <Collapse>
      <Panel header="Pages" key="1">
        <p>
          Select the below option to add a new menu item "About" which will
          display information about you.
        </p>
        <Checkbox
          checked={!!settings.show_about_page}
          onChange={(e) => onChange("show_about_page", e.target.checked)}
        >
          Display About Page
        </Checkbox>
        <Divider />
        <p>
          Select the below option to add a new menu item "Tags" which will
          display all the tags with the post count. <br />
          This will allow users to explore all the collection of posts. <br />
          It is a good idea to enable this after you have written 10+ posts
        </p>
        <Checkbox
          checked={!!settings.show_tags_page}
          onChange={(e) => onChange("show_tags_page", e.target.checked)}
        >
          Display Tags Page
        </Checkbox>
      </Panel>
    </Collapse>
  );
};
export default Pages;
