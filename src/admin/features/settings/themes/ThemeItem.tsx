import React, { useState } from "react";
import {
  ThemeSettings,
  ThemesQuery,
  ThemesQueryVariables,
  UpdateThemesMutation,
} from "../../../../__generated__/gqlTypes";

import { IThemeConfig } from "../../../../types/types";
import { QUERY_THEMES } from "../../../../shared/queries/Queries";
import StyledItem from "./ThemeItem.css";
import ThemeSettingsModal from "./ThemeSettingsModal";
import { UPDATE_THEME_SETTINGS } from "../../../../shared/queries/Mutations";
import appoloClient from "../../../../shared/apolloClient";
import styled from "styled-components";

const SettingsLink = styled.a`
  text-decoration: none;
`;

interface IThemeItemProps {
  theme: IThemeConfig;
  name: string;
  selectTheme: (e: React.MouseEvent, selectedTheme: IThemeConfig) => void;
}
const ThemeItem: React.FC<IThemeItemProps> = ({ theme, selectTheme }) => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [data, setData] = useState<ThemeSettings[]>();

  const displaySettings = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response = await appoloClient().query<
      ThemesQuery,
      ThemesQueryVariables
    >({
      query: QUERY_THEMES,
      variables: { name: theme.folder_name },
      fetchPolicy: "no-cache",
    });

    setData(response.data.themes[0].settings);
    setSettingsOpen(true);

    return false;
  };

  const onSave = async data => {
    const isAdmin = true;
    await appoloClient(isAdmin).mutate<UpdateThemesMutation>({
      mutation: UPDATE_THEME_SETTINGS,
      variables: {
        name: theme.folder_name,
        settings: data,
      },
    });
    setSettingsOpen(false);
  };

  return (
    <React.Fragment>
      <StyledItem
        className={"theme-item" + (theme.active ? " active" : "")}
        onClick={e => selectTheme(e, theme)}
      >
        <div className="theme-thumbnail">
          <span className="status">Active</span>
          <img className="theme-image" src={theme.thumbnail} />
        </div>
        <div className="theme-body with-border">
          <div className="theme-header">
            <div className="theme-name">
              <span>
                {theme.name} by {theme.author}
              </span>
              {theme.settings && (
                <SettingsLink onClick={displaySettings}>
                  <span className="material-icons">settings</span>
                </SettingsLink>
              )}
            </div>
            <div className="theme-meta">{theme.description}</div>
          </div>
        </div>
      </StyledItem>
      {settingsOpen && (
        <ThemeSettingsModal
          onClose={() => setSettingsOpen(false)}
          data={data as ThemeSettings[]}
          name={theme.name}
          onSave={onSave}
        />
      )}
    </React.Fragment>
  );
};

export default ThemeItem;
