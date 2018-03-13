import React, { Component } from "react";

const qs = s => document.querySelector(s);

class PublishDrawer extends Component {
    constructor(props) {
        super(props);
        this.toggleOptions = this.toggleOptions.bind(this);
    }
    toggleOptions(e) {
        e.preventDefault();
        if (document.body.classList.contains("options-open")) {
            document.body.classList.remove("options-open");
            qs(".article-holder").classList.add("col-lg-offset-2");
        } else {
            document.body.classList.add("options-open");
            qs(".article-holder").classList.remove("col-lg-offset-2");
        }
    }
    render() {
        return (
            <div>
                <a
                    href="#"
                    onClick={this.toggleOptions}
                    className="post-options hide"
                >
                    <i className="fa fa-cog" /> Options
                </a>
            </div>
        );
    }
}

export default PublishDrawer;
