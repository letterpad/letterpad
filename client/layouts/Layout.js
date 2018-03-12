import React, { Component } from "react";
import FullWidthLayout from "./FullWidthLayout";
import CenteredLayout from "./CenteredLayout";

export default function Layout(Element, props) {
    const settings = props.settings;
    const layout = settings.layout_display.value;

    return class extends Component {
        render() {
            switch (layout) {
                case "centered":
                    return (
                        <CenteredLayout
                            component={
                                <Element
                                    {...this.props}
                                    {...props}
                                    settings={settings}
                                />
                            }
                        />
                    );
                case "two-column":
                    return (
                        <FullWidthLayout
                            component={
                                <Element
                                    {...this.props}
                                    {...props}
                                    settings={settings}
                                />
                            }
                        />
                    );
            }
        }
    };
}
