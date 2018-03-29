import React, { Component } from "react";
import { Link } from "react-router-dom";

class Item extends Component {
    render() {
        let slug = "";
        if (this.props.type === "page") {
            slug = "/page/" + this.props.slug;
        } else if (this.props.type == "category") {
            slug = "/posts/" + this.props.slug;
        }
        return (
            <li>
                <Link to={slug}>{this.props.name}</Link>
            </li>
        );
    }
}

export default Item;
