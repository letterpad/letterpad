import React, { Component } from "react";
import PropTypes from "prop-types";
import appoloClient from "shared/apolloClient";
import styled from "styled-components";

import { THEME_SETTINGS } from "shared/queries/Queries";
import { UPDATE_THEME_SETTINGS } from "../../../shared/queries/Mutations";
import ThemeSettingsModal from "./ThemeSettingsModal";
import StyledItem from "./ThemeItem.css";

const SettingsLink = styled.a`
    text-decoration: none;
`;
export default class ThemeItem extends Component {
    static propTypes = {
        theme: PropTypes.object.isRequired,
        activateTheme: PropTypes.func.isRequired
    };

    state = {
        settings: null,
        settingsOpen: false
    };

    displaySettings = async e => {
        e.preventDefault();
        let response = await appoloClient().query({
            query: THEME_SETTINGS,
            variables: { name: this.props.theme.short_name },
            fetchPolicy: "no-cache"
        });

        this.setState({
            settings: response.data.themeSettings[0],
            settingsOpen: true
        });
        return false;
    };
    toggleSettings = () => {
        this.setState({ settingsOpen: !this.state.settingsOpen });
    };
    onSave = async data => {
        const isAdmin = true;
        await appoloClient(isAdmin).mutate({
            mutation: UPDATE_THEME_SETTINGS,
            variables: {
                name: this.props.theme.short_name,
                value: JSON.stringify(data)
            }
        });
        this.setState({ settingsOpen: false });
    };
    render() {
        const theme = this.props.theme;

        return (
            <React.Fragment>
                <StyledItem
                    className={"theme-item" + (theme.active ? " active" : "")}
                    onClick={e => this.props.activateTheme(e, this.props.theme)}
                >
                    <div className="theme-thumbnail">
                        <img className="theme-image" src={theme.thumbnail} />
                    </div>
                    <div className="theme-body with-border">
                        <div className="theme-header">
                            <div className="theme-name">
                                <span>
                                    {theme.name} by {theme.author}
                                </span>
                                {theme.settings && (
                                    <SettingsLink
                                        onClick={this.displaySettings}
                                    >
                                        <span className="material-icons">
                                            settings
                                        </span>
                                    </SettingsLink>
                                )}
                            </div>
                            <div className="theme-meta">
                                {theme.description}
                            </div>
                        </div>
                    </div>
                </StyledItem>
                {this.state.settingsOpen && (
                    <ThemeSettingsModal
                        isOpen={this.state.settingsOpen}
                        onClose={this.toggleSettings}
                        data={this.state.settings}
                        onSave={this.onSave}
                    />
                )}
            </React.Fragment>
        );
    }
}
