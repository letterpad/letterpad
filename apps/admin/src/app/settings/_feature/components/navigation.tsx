import { Navigation } from "letterpad-graphql";
import { Controller, useFormContext } from "react-hook-form";

import NavigationBuilder from "@/components/navigation-builder";

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
            menuData={watch("menu") ?? []}
            updateOption={updateMenu}
          />
        )}
      />
    </>
  );
};
export default NavigationPanel;
