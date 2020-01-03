import React, { useState } from "react";
import appoloClient from "../../../../shared/apolloClient";
import styled from "styled-components";

import { QUERY_THEMES } from "../../../../shared/queries/Queries";
import { UPDATE_THEME_SETTINGS } from "../../../../shared/queries/Mutations";
import ThemeSettingsModal from "./ThemeSettingsModal";
import StyledItem from "./ThemeItem.css";
import { IThemeConfig } from "../../../../types/types";
import {
  UpdateThemesMutation,
  ThemesQuery,
  ThemesQueryVariables,
} from "../../../../__generated__/gqlTypes";

const SettingsLink = styled.a`
  text-decoration: none;
`;

interface IThemeItemProps {
  theme: IThemeConfig;
  selectTheme: (e: React.MouseEvent, selectedTheme: IThemeConfig) => void;
}

const ThemeItem: React.FC<IThemeItemProps> = ({ theme, selectTheme }) => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  const displaySettings = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response = await appoloClient().query<
      ThemesQuery,
      ThemesQueryVariables
    >({
      query: QUERY_THEMES,
      variables: { name: theme.short_name },
      fetchPolicy: "no-cache",
    });

    setData(response.data.themes[0]);
    setSettingsOpen(true);

    return false;
  };

  const onSave = async data => {
    const isAdmin = true;
    await appoloClient(isAdmin).mutate<UpdateThemesMutation>({
      mutation: UPDATE_THEME_SETTINGS,
      variables: {
        name: theme.short_name,
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
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          data={data}
          onSave={onSave}
        />
      )}
    </React.Fragment>
  );
};

export default ThemeItem;
