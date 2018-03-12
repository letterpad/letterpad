import React, { Component } from "react";
import FullWidthLayout from "./FullWidthLayout";
import CenteredLayout from "./CenteredLayout";

export default function Layout(Element, props) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        render() {
            const _props = { ...this.props, ...props, settings };

            if (layout == "centered") {
                return <CenteredLayout component={<Element {..._props} />} />;
            } else if (layout == "two-column") {
                return <FullWidthLayout component={<Element {..._props} />} />;
            }
        }
    };
}
