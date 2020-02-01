import React, { useEffect, useState } from "react";
// import { notify } from "react-notify-toast";

import utils from "../../../shared/util";

import ThemeItem from "./themes/ThemeItem";

import StyledGrid from "../../components/grid";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { IThemeConfig } from "../../../types/types";

interface IThemesProps {
  updateOption: (option: SettingOptions, value: string) => void;
  data: { [option in SettingOptions]: Setting };
  label: string;
}

const Themes: React.FC<IThemesProps> = ({ updateOption }) => {
  const [themes, setThemes] = useState<IThemeConfig[]>([]);

  useEffect(() => {
    const url = utils.makeUrl("/admin/getThemes");
    fetch(url, { headers: { Authorization: localStorage.token } })
      .then(res => res.json())
      .then((themes: IThemeConfig[]) => {
        setThemes(themes);
      });
  }, []);

  // const activateTheme = async (e?: React.MouseEvent) => {
  //   e && e.preventDefault();
  //   const settings = [];
  //   Object.keys(this.updatedOptions).forEach(option => {
  //     let value = this.updatedOptions[option];
  //     settings.push({
  //       option,
  //       value,
  //     });
  //   });
  //   await updateOption(settings);
  //   notify.show("Theme Activated", "success", 3000);
  // };

  const selectTheme = (e: React.MouseEvent, selectedTheme: IThemeConfig) => {
    e.preventDefault();
    // if (e.target.className == "material-icons") return;
    const modifiedThemes = themes.map(theme => {
      theme.active = false;
      if (theme.name === selectedTheme.name) {
        theme.active = true;
      }
      return theme;
    });
    setThemes(modifiedThemes);
    updateOption(SettingOptions.Theme, selectedTheme.short_name);
  };

  return (
    <div>
      <StyledGrid columns="repeat(auto-fit,minmax(250px,1fr))">
        {themes.map((theme, idx) => (
          <ThemeItem key={idx} theme={theme} selectTheme={selectTheme} />
        ))}
      </StyledGrid>
    </div>
  );
};

export default Themes;
