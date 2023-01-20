import { Divider, Switch } from "ui";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

interface Props {
  settings: SettingsFragmentFragment;
}

const Pages: React.FC<Props> = ({ settings }) => {
  const { updateSettings } = useUpdateSettings();
  return (
    <>
      <Switch
        data-testid="aboutPageCb"
        active={!!settings.show_about_page}
        onChange={(checked) => updateSettings({ show_about_page: checked })}
        label='Select this to add a new menu item "About" which will display
        information about you.'
      />
      <Divider />
      <Switch
        active={!!settings.show_tags_page}
        data-testId="tagsPageCb"
        onChange={(checked) => updateSettings({ show_tags_page: checked })}
        label='Select this to add a new menu item "Tags" which will display
        all the tags with the post count.'
      />
    </>
  );
};
export default Pages;
