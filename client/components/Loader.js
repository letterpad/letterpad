import React, { Component } from "react";

export default class Loader extends Component {
    render() {
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
