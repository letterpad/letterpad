import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { MenuConstruction } from "../../components/Settings";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";
import {
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../../shared/queries/Queries";

class MenuBuilder extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = {};
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
    }

    setOption(option, value) {
        this.updatedOptions[option] = value;
    }

    submitData(e) {
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
        this.props.updateOptions(settings).then(res => {});
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
                        {t("save")}
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

const createQueryWithData = graphql(UPDATE_OPTIONS, {
    props: ({ mutate }) => ({
        updateOptions: data =>
            mutate({
                variables: { options: data },
                updateQueries: {
                    getOptions: (prev, { mutationResult }) => ({
                        post: {
                            ...prev.settings,
                            ...mutationResult.data.updateOptions
                        }
                    })
                }
            })
    })
});

MenuBuilder.propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object,
    pages: PropTypes.object,
    categories: PropTypes.object,
    settings: PropTypes.object
};

MenuBuilder.contextTypes = {
    t: PropTypes.func
};

export default createQueryWithData(CategoriesData(PagesData(MenuBuilder)));
