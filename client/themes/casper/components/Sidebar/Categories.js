import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Categories extends Component {
    getLink({ name, slug }) {
        let link = "/category/" + slug;
        return <Link to={link}>{name}</Link>;
    }

    render() {
        return (
            <div className="card">
                <div className="module-title">Categories</div>
                <div className="x_content">
                    <ul>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            }
                            return this.props.categories.map((category, i) => {
                                return (
                                    <li key={i}>{this.getLink(category)}</li>
                                );
                            });
                        })()}
                    </ul>
                </div>
            </div>
        );
    }
}
