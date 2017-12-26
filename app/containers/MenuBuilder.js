import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import Menu from "../components/settings/Menu";
import {
    GET_OPTIONS,
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";

const SubmitBtn = ({ handleClick }) => (
    <button type="submit" onClick={handleClick} className="btn btn-blue btn-sm">
        Save
    </button>
);

SubmitBtn.propTypes = {
    handleClick: PropTypes.func
};

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
        this.props.updateOptions(settings).then(res => {
            console.log(res);
        });
    }
    render() {
        const data = {};
        if (this.props.options.loading) {
            return <div>hello</div>;
        }
        this.props.options.settings.forEach(setting => {
            data[setting.option] = setting;
        });

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Menu Settings</div>
                    <div className="module-subtitle">Configure your menu</div>
                    <Menu
                        data={data}
                        pages={this.props.pages}
                        categories={this.props.categories.taxonomies}
                        updateOption={this.setOption}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_OPTIONS, {
    name: "options"
});

const CategoriesData = graphql(GET_TAXONOMIES, {
    name: "categories",
    options: { variables: { type: "post_category" } }
});

const PagesData = graphql(GET_PAGE_NAMES, {
    name: "pages",
    options: () => ({ variables: { type: "page" } })
});
const Data = compose(ContainerWithData, CategoriesData, PagesData);

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
    categories: PropTypes.object
};

export default createQueryWithData(Data(MenuBuilder));
