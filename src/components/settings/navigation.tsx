import { Collapse } from "antd";
import { useMemo } from "react";

import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Navigation } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { debounce } from "@/shared/utils";

import NavigationBuilder from "../navigation-builder";
const { Panel } = Collapse;

interface Props {
  settings: SettingsFragmentFragment;
}
const NavigationPanel: React.FC<Props> = ({ settings }) => {
  const { updateSettingsAPI, updateLocalState } = useUpdateSettings();

  const debounceUpdateSettings = useMemo(
    () => debounce((data) => updateSettingsAPI(data), 500),
    [updateSettingsAPI],
  );

  const updateMenu = (menu: Navigation[]) => {
    if (
      menu &&
      menu.filter((m) => m.slug === "" || m.label === "").length === 0
    ) {
      debounceUpdateSettings({ menu });
      updateLocalState({ menu });
    }
  };

  return (
    <Collapse>
      <Panel header="Navigation" key="1" className="navigation">
        <NavigationBuilder
          menuData={settings.menu}
          updateOption={(menu) => updateMenu(menu)}
        />
      </Panel>
    </Collapse>
  );
};
export default NavigationPanel;
