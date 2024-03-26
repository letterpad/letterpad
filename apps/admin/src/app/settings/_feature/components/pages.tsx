import { SettingsFragmentFragment } from "letterpad-graphql";
import { Controller, useFormContext } from "react-hook-form";
import { Divider, Switch } from "ui";

import { useUpdateSettings } from "../api.client";

interface Props {
  settings: SettingsFragmentFragment;
}

const Pages: React.FC<Props> = ({ settings }) => {
  const { updateSettings } = useUpdateSettings();
  const data = useFormContext();
  return (
    <>
      <Controller
        name="show_about_page"
        control={data.control}
        render={({ field: { onChange } }) => (
          <Switch
            data-testid="aboutPageCb"
            active={!!settings.show_about_page}
            onChange={onChange}
            label='Select this to add a new menu item "About" which will display
        information about you.'
          />
        )}
      />

      <Divider />
      <Controller
        name="show_tags_page"
        control={data.control}
        render={({ field: { onChange } }) => (
          <Switch
            active={!!settings.show_tags_page}
            data-testid="tagsPageCb"
            onChange={onChange}
            label='Select this to add a new menu item "Tags" which will display
        all the tags with the post count.'
          />
        )}
      />
    </>
  );
};
export default Pages;
