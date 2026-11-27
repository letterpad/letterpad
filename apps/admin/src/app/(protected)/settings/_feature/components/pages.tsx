import { Controller, useFormContext } from "react-hook-form";
import { Divider, Switch } from "ui/dist/index.mjs";

const Pages = () => {
  const data = useFormContext();
  return (
    <>
      <Controller
        name="show_about_page"
        control={data.control}
        render={({ field: { onChange, value } }) => (
          <Switch
            data-testid="aboutPageCb"
            active={!!value}
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
        render={({ field: { onChange, value } }) => (
          <Switch
            active={!!value}
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
