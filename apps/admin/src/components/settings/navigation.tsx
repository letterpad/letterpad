import { Controller, useFormContext } from "react-hook-form";
import { Button } from "ui";

import { Navigation } from "@/__generated__/__types__";

import NavigationBuilder from "../navigation-builder";

const NavigationPanel = () => {
  const { control, setValue, watch } = useFormContext();

  const updateMenu = (menu: Navigation[]) => {
    if (
      menu &&
      menu.filter((m) => m.slug === "" || m.label === "").length === 0
    ) {
      setValue("menu", menu, { shouldDirty: true });
    }
  };

  return (
    <>
      <Controller
        name="menu"
        control={control}
        render={() => (
          <NavigationBuilder
            menuData={watch("menu")}
            updateOption={updateMenu}
          />
        )}
      />
      <Button type="submit">Save</Button>
    </>
  );
};
export default NavigationPanel;
