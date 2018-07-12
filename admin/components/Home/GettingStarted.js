import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

const GettingStarted = ({ t }) => {
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
                    <Link to="/">{t("home.view")}</Link>
                </div>
            </div>
        </div>
    );
};

GettingStarted.propTypes = {
    t: PropTypes.func
};

export default translate("translations")(GettingStarted);
