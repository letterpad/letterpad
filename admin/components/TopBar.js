import React, { Component } from "react";
import User from "./TopBar/User";
import PublishDrawer from "./TopBar/PublishDrawer";

class TopBar extends Component {
    render() {
        return (
            <div className="top-bar">
                <div className="left-block pull-left">
                    <PublishDrawer />
                </div>
                <div className="right-block pull-right">
                    <User author={this.props.author} />
                </div>
            </div>
        );
    }
}

export default TopBar;
