import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Categories extends Component {
    getLink(name) {
        let link = "/category/" + name.toLowerCase();
        return <Link to={link}>{name}</Link>;
    }

    render() {
        return (
            <div className="card">
                <div className="module-title">Categories</div>
                <div className="x_content">
                    <ul style={{ "padding-left": "16px" }}>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            }
                            return this.props.categories.map((category, i) => {
                                return (
                                    <li key={i}>
                                        {this.getLink(category.name)}
                                    </li>
                                );
                            });
                        })()}
                    </ul>
                </div>
            </div>
        );
    }
}
