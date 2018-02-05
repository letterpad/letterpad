import React from "react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
    return (
        <div className="card">
            <div className="module-title">Getting started</div>
            <div className="module-subtitle">
                Here are some helpful links we've gathered to get you started
            </div>
            <div className="listing">
                <div>
                    <span>
                        <i className="fa fa-cog" />
                    </span>
                    <Link to="/admin/settings">Configure your settings</Link>
                </div>
                <div>
                    <span>
                        <i className="fa fa-pencil" />
                    </span>
                    <Link to="/admin/post-new">Write a blog post</Link>
                </div>
                <div>
                    <span>
                        <i className="fa fa-eye" />
                    </span>
                    <Link to="/admin/post-new">View your site</Link>
                </div>
            </div>
        </div>
    );
};
export default GettingStarted;
