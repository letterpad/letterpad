import { IThemeConfig, UpdateSettingOption } from "../../../types/types";
import React, { useEffect, useState } from "react";

import { Setting } from "../../../__generated__/gqlTypes";
import ThemeItem from "./themes/ThemeItem";
import config from "../../../config";
import { device } from "../devices";
import styled from "styled-components";
import utils from "../../../shared/util";

interface IThemesProps {
  updateOption: (setting: UpdateSettingOption) => void;
  data: Setting;
}

const Themes: React.FC<IThemesProps> = ({ updateOption }) => {
  const [themes, setThemes] = useState<IThemeConfig[]>([]);

  useEffect(() => {
    const url = utils.makeUrl(config.BASE_NAME + "/admin/getThemes");
    fetch(url, { headers: { Authorization: localStorage.token } })
      .then(res => res.json())
      .then((themes: IThemeConfig[]) => {
        setThemes(themes);
      });
  }, []);

  const selectTheme = (e: React.MouseEvent, selectedTheme: IThemeConfig) => {
    e.preventDefault();
    const modifiedThemes = themes.map(theme => {
      theme.active = false;
      if (theme.name === selectedTheme.name) {
        theme.active = true;
      }
      return theme;
    });
    setThemes(modifiedThemes);
    updateOption({ theme: selectedTheme.folder_name });
  };

  return (
    <div>
      <Container>
        {themes.map((theme, idx) => (
          <ThemeItem
            key={idx}
            theme={theme}
            selectTheme={selectTheme}
            name={theme.name}
          />
        ))}
      </Container>
    </div>
  );
};

export default Themes;

const Container = styled.div`
  display: grid;
  height: auto;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;

  @media ${device.laptop} {
    grid-template-columns: 1fr 1fr;
  }
  @media ${device.tablet} {
    grid-template-columns: 1fr;
  }
`;
