import React, { Component } from "react";

export default class About extends Component {
    render() {
        return (
            <div className="card">
                <div className="module-title">About</div>
                <div className="x_content">{this.props.about}</div>
            </div>
        );
    }
}
