import React, { Component } from "react";

const qs = s => document.querySelector(s);

class PublishDrawer extends Component {
    state = {
        zenText: "Enable Zenmode"
    };
    
    toggleFullScreen = e => {
        e.preventDefault();
        const isDistractFree = document.body.classList.contains(
            "distract-free"
        );
        if (isDistractFree) {
            document.body.classList.remove("distract-free");
            this.setState({ zenText: "Enable Zenmode" });
        } else {
            document.body.classList.add("distract-free");
            this.setState({ zenText: "Disable Zenmode" });
        }
    };

    toggleOptions = e => {
        e.preventDefault();
        if (document.body.classList.contains("options-open")) {
            document.body.classList.remove("options-open");
            qs(".article-holder").classList.add("col-lg-offset-2");
        } else {
            document.body.classList.add("options-open");
            qs(".article-holder").classList.remove("col-lg-offset-2");
        }
    };
    render() {
        return (
            <div style={{ display: "flex" }}>
                <a
                    href="#"
                    onClick={this.toggleOptions}
                    className="post-options hide pointer"
                >
                    <i className="fa fa-cog" /> Options
                </a>
                <a
                    href="#"
                    className="full-screen pointer hide"
                    onClick={this.toggleFullScreen}
                >
                    {this.state.zenText}
                </a>
            </div>
        );
    }
}

export default PublishDrawer;
