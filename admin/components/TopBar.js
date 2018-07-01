import React from "react";
import PropTypes from "prop-types";

import User from "./TopBar/User";
import PublishDrawer from "./TopBar/PublishDrawer";

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
