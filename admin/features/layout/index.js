import React, { Component } from "react";
import styled from "styled-components";

import Header from "../header";
import Sidebar from "../sidebar";

import { lightTheme, darkTheme } from "../../css-variables";
import { StyledLayout, defaultStyles } from "./Layout.css";

const CSSVariables = styled.div`
    ${props => (props.dark ? darkTheme : lightTheme)};
`;

const NoLayout = styled.div`
    ${defaultStyles};
`;
export default function Layout(ComponentClass, props) {
    const settings = props.settings;

    return class extends Component {
        state = {
            sidebarOpen: true
        };

        mounted = false;

        componentDidMount() {
            this.mounted = true;
            if (typeof window !== "undefined") {
                window.addEventListener("resize", this.onResize);

                this.onResize();
            }
        }

        componentWillUnmount() {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", this.onResize);
            }
        }

        toggleSidebar = e => {
            if (e.type == "mouseover") {
                document.body.classList.add("hovering");
            } else {
                document.body.classList.remove("hovering");
            }
        };

        onResize = () => {
            if (!this.mounted) return false;
            if (document.body.clientWidth < 991) {
                this.setState({ sidebarOpen: false });
            } else {
                this.setState({ sidebarOpen: true });
            }
        };

        sidebarToggle = () => {
            this.setState({ sidebarOpen: !this.state.sidebarOpen });
        };

        render() {
            const _props = { ...this.props, ...props, settings };
            const classes = this.state.sidebarOpen ? "" : " collapsed";
            return (
                <CSSVariables dark>
                    {props.layout == "none" ? (
                        <NoLayout>
                            <div className="content-area">
                                <ComponentClass {..._props} />
                            </div>
                        </NoLayout>
                    ) : (
                        <StyledLayout className={"main a two-column" + classes}>
                            <Header
                                sidebarToggle={this.sidebarToggle}
                                settings={settings}
                                author={_props.author}
                            />
                            <Sidebar {..._props} />
                            <main>
                                <div className="content-area">
                                    <ComponentClass {..._props} />
                                </div>
                            </main>
                        </StyledLayout>
                    )}
                </CSSVariables>
            );
        }
    };
}
