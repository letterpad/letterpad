import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const GettingStarted = (props, { t }) => {
    return (
        <div className="card masonry-grid-item">
            <div className="module-title">{t("home.gettingStarted")}</div>
            <div className="module-subtitle">{t("home.tagline")}</div>
            <div className="listing">
                <div>
                    <span>
                        <i className="fa fa-cog" />
                    </span>
                    <Link to="/admin/settings">{t("home.configure")}</Link>
                </div>
                <div>
                    <span>
                        <i className="fa fa-pencil" />
                    </span>
                    <Link to="/admin/post-new">{t("home.write")}</Link>
                </div>
                <div>
                    <span>
                        <i className="fa fa-eye" />
                    </span>
                    <Link to="/" target="_blank">
                        {t("home.view")}
                    </Link>
                </div>
            </div>
        </div>
    );
};
GettingStarted.contextTypes = {
    t: PropTypes.func
};
export default GettingStarted;
