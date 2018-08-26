import React, { Component } from "react";
import styled from "styled-components";

import { lightTheme, darkTheme } from "../../css-variables";
import { defaultStyles } from "./Layout.css";

const CSSVariables = styled.div`
    ${props => (props.dark ? darkTheme : lightTheme)};
`;

const StyledLayout = styled.div`
    ${defaultStyles};
`;

export default function Layout(ComponentClass, props) {
    const settings = props.settings;

    return class extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            const _props = { ...this.props, ...props, settings };
            return (
                <CSSVariables dark>
                    <StyledLayout>
                        <div className="content-area">
                            <ComponentClass {..._props} />
                        </div>
                    </StyledLayout>
                </CSSVariables>
            );
        }
    };
}
