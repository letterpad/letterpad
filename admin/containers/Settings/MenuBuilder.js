import React, { Component } from "react";
import { graphql } from "react-apollo";
import { notify } from "react-notify-toast";
import PropTypes from "prop-types";

import { MenuConstruction } from "../../components/Settings";
import {
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../../shared/queries/Queries";
import UpdateOptions from "../../data-connectors/UpdateOptions";

class MenuBuilder extends Component {
    static propTypes = {
        updateOptions: PropTypes.func,
        options: PropTypes.object,
        pages: PropTypes.object,
        categories: PropTypes.object,
        settings: PropTypes.object
    };

    static contextTypes = {
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.updatedOptions = {};
        document.body.classList.add("menu-builder-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("menu-builder-page");
    }

    setOption = (option, value) => {
        this.updatedOptions[option] = value;
    }

    submitData = (e) => {
        e.preventDefault();
        const settings = [];
        for (const option in this.updatedOptions) {
            if ({}.hasOwnProperty.call(this.updatedOptions, option)) {
                settings.push({
                    option,
                    value: this.updatedOptions[option]
                });
            }
        }
        this.props.updateOptions(settings).then(() => {
            notify.show("Navigation menu saved", "success", 3000);
        });
    }

    render() {
        if (this.props.settings.loading) {
            return <div>hello</div>;
        }
        const { t } = this.context;
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">{t("menu.title")}</div>
                    <div className="module-subtitle">{t("menu.tagline")}</div>
                    <MenuConstruction
                        data={this.props.settings}
                        pages={this.props.pages}
                        categories={this.props.categories}
                        updateOption={this.setOption}
                    />
                    <button
                        type="submit"
                        onClick={this.submitData}
                        className="btn btn-blue btn-sm"
                    >
                        {t("common.save")}
                    </button>
                </div>
            </section>
        );
    }
}

const CategoriesData = graphql(GET_TAXONOMIES, {
    name: "categories",
    options: () => ({ variables: { type: "post_category" } })
});

const PagesData = graphql(GET_PAGE_NAMES, {
    name: "pages",
    options: () => ({ variables: { type: "page", status: "publish" } })
});

export default UpdateOptions(CategoriesData(PagesData(MenuBuilder)));
