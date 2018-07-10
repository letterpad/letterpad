import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

const Filter = ({ id, label, status, changeStatus }) => {
    let selected = "publish";
    if (status) {
        selected = status;
    }
    const active = selected == id ? "active" : "";
    return (
        <a
            onClick={e => {
                e.preventDefault();
                changeStatus(id);
            }}
            className={"filter-item " + id + " " + active}
        >
            {label}
        </a>
    );
};
Filter.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    status: PropTypes.string,
    changeStatus: PropTypes.func
};

export const PostFilters = ({ selectedStatus, changeStatus, t }) => {
    return (
        <div className="post-filters m-b-20">
            <Filter
                id="all"
                label={t("common.all")}
                status={selectedStatus}
                changeStatus={changeStatus}
            />
            <Filter
                id="publish"
                label={t("common.published")}
                status={selectedStatus}
                changeStatus={changeStatus}
            />
            <Filter
                id="draft"
                label={t("common.drafts")}
                status={selectedStatus}
                changeStatus={changeStatus}
            />
            <Filter
                id="trash"
                label={t("common.deleted")}
                status={selectedStatus}
                changeStatus={changeStatus}
            />
        </div>
    );
};

PostFilters.propTypes = {
    selectedStatus: PropTypes.string,
    changeStatus: PropTypes.func,
    t: PropTypes.func
};

export default translate("translations")(PostFilters);
