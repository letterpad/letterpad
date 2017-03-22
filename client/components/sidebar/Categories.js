import React, { Component } from "react";
import { Link } from "react-router";

export default class Categories extends Component {
    getLink(name) {
        let link = "/category/" + name.toLowerCase();
        return (
            <Link to={link}>
                {name}
            </Link>
        );
    }

    render() {
        return (
            <aside id="ajaxtown_category_widget" className="widget">
                <h3 className="widget-title">Categories</h3>
                <div className="category-widget">
                    <ul>
                        {(() => {
                            if (this.props.loading) {
                                return <div>Loading...</div>;
                            } else {
                                return this.props.categories.map((
                                    category,
                                    i
                                ) => {
                                    return (
                                        <li key={i}>
                                            {this.getLink(category.name)}
                                        </li>
                                    );
                                });
                            }
                        })()}
                    </ul>
                </div>
            </aside>
        );
    }
}
