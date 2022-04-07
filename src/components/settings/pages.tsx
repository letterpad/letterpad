import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { Checkbox, Collapse, Divider } from "antd";
const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
}

const Pages: React.FC<Props> = ({ settings }) => {
  const { debounceUpdateSettings } = useUpdateSettings();
  return (
    <Collapse>
      <Panel header="Pages" key="1" className="pages">
        <Checkbox
          data-testid="aboutPageCb"
          checked={!!settings.show_about_page}
          onChange={(e) =>
            debounceUpdateSettings({ show_about_page: e.target.checked })
          }
        >
          Select this to add a new menu item "About" which will display
          information about you.
        </Checkbox>
        <Divider />

        <Checkbox
          checked={!!settings.show_tags_page}
          data-testId="tagsPageCb"
          onChange={(e) =>
            debounceUpdateSettings({ show_tags_page: e.target.checked })
          }
        >
          Select this to add a new menu item "Tags" which will display all the
          tags with the post count. <br />
          This will allow users to explore all the collection of posts. <br />
          It is a good idea to enable this after you have written 10+ posts
        </Checkbox>
      </Panel>
    </Collapse>
  );
};
export default Pages;
