import React from "react";
import User from "./TopBar/User";
import PublishDrawer from "./TopBar/PublishDrawer";
import PropTypes from "prop-types";

const TopBar = ({ author }) => (
    <div className="top-bar">
        <div className="left-block pull-left">
            <PublishDrawer />
        </div>
        <div className="right-block pull-right">
            <User author={author} />
        </div>
    </div>
);
TopBar.propTypes = {
    author: PropTypes.object.isRequired
};
export default TopBar;
