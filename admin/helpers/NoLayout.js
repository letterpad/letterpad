import React, { Component } from "react";

export default function Layout(ComponentClass, props) {
    const settings = props.settings;

    return class extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            const _props = { ...this.props, ...props, settings };
            return (
                <div className="full-width">
                    <div className="content-area">
                        <ComponentClass {..._props} />
                    </div>
                </div>
            );
        }
    };
}
