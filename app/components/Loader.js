import React, { Component } from "react";

export default class Loader extends Component {
    render() {
        if (this.props.type == "spin") {
            return <i className="fa fa-circle-o-notch fa-spin fa-2x" />;
        }
        return (
            <div className="progress progress-striped active">
                <div
                    className="progress-bar progress-bar-success"
                    style={{ width: "100%" }}
                />
            </div>
        );
    }
}
