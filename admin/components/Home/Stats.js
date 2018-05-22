import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Stats = ({ stats, loading }, { t }) => {
    const items = [
        {
            label: "Posts",
            value: stats.posts.published,
            icon: "book",
            link: "/admin/posts"
        },
        {
            label: "Pages",
            value: stats.pages.published,
            icon: "file",
            link: "/admin/pages"
        },
        {
            label: "Tags",
            value: stats.tags,
            icon: "tags",
            link: "/admin/tags"
        },
        {
            label: "Categories",
            value: stats.categories,
            icon: "folder",
            link: "/admin/categories"
        }
    ];

    const data = items.map((item, idx) => (
        <div key={idx}>
            <span>
                <i className={"fa fa-" + item.icon} />
            </span>
            <Link to={item.link}>
                <span>{item.value}</span>&nbsp;&nbsp;
                <span>{item.label}</span>
            </Link>
        </div>
    ));

    return (
        <div className="card masonry-grid-item">
            <div className="module-title">{t("home.stats")}</div>
            <div className="module-subtitle">{t("home.stats.tagline")}</div>
            {!loading && <div className="listing">{data}</div>}
        </div>
    );
};

Stats.propTypes = {
    loading: PropTypes.bool,
    stats: PropTypes.object
};
Stats.defaultProps = {
    stats: {
        posts: {},
        pages: {}
    }
};
Stats.contextTypes = {
    t: PropTypes.func
};
export default Stats;
