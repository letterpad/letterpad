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
            aria-label="Show About page"
            label="Show About page"
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
            aria-label="Show Tags page"
            label="Show Tags page"
          />
        )}
      />
    </>
  );
};
export default Pages;
