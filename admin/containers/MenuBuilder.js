import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import Menu from "../components/settings/Menu";
import MenuConstruction from "../components/settings/MenuConstruction";
import {
    GET_OPTIONS,
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";
import PageHeader from "../components/PageHeader";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";

const SubmitBtn = ({ handleClick }) => (
    <Button raised color="primary" onClick={handleClick}>
        Save
    </Button>
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
        this.props.updateOptions(settings).then(res => {});
    }
    render() {
        const data = {};
        if (this.props.settings.loading) {
            return <div>hello</div>;
        }
        return (
            <div>
                <PageHeader
                    title="Menu Settings"
                    subtitle="Configure your menu"
                />
                <div className="col-lg-12" style={{ marginTop: 16 }}>
                    <MenuConstruction
                        data={this.props.settings}
                        pages={this.props.pages}
                        categories={this.props.categories}
                        updateOption={this.setOption}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
            </div>
        );
    }
}

const CategoriesData = graphql(GET_TAXONOMIES, {
    name: "categories",
    options: () => ({ variables: { type: "post_category" } })
});

const PagesData = graphql(GET_PAGE_NAMES, {
    name: "pages",
    options: () => ({ variables: { type: "page" } })
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

export default createQueryWithData(CategoriesData(PagesData(MenuBuilder)));
