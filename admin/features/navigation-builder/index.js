import React, { Component } from "react";
import { graphql } from "react-apollo";
import { notify } from "react-notify-toast";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Loader from "../../components/loader";
import NavigationTreeBuilder from "./NavigationTreeBuilder";

import UpdateOptions from "../../data-connectors/UpdateOptions";
import {
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../../shared/queries/Queries";

import StyledSection from "../../components/section";
import StyledButton from "../../components/button";

class NavigationBuilder extends Component {
    static propTypes = {
        updateOptions: PropTypes.func,
        options: PropTypes.object,
        pages: PropTypes.object,
        categories: PropTypes.object,
        settings: PropTypes.object,
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.updatedOptions = {};
        document.body.classList.add("navigation-builder-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("navigation-builder-page");
    }

    setOption = (option, value) => {
        this.updatedOptions[option] = value;
    };

    submitData = e => {
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
    };

    render() {
        if (this.props.settings.loading) {
            return <Loader />;
        }
        const { t } = this.props;
        return (
            <StyledSection title={t("menu.title")} subtitle={t("menu.tagline")}>
                <div>
                    <NavigationTreeBuilder
                        data={this.props.settings}
                        pages={this.props.pages}
                        categories={this.props.categories}
                        updateOption={this.setOption}
                    />
                    <StyledButton success onClick={this.submitData}>
                        {t("common.save")}
                    </StyledButton>
                </div>
            </StyledSection>
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

export default translate("translations")(
    UpdateOptions(CategoriesData(PagesData(NavigationBuilder)))
);
