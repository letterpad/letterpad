import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import General from "../components/settings/General";
import Social from "../components/settings/Social";
import Sidebar from "../components/settings/Sidebar";
import Menu from "../components/settings/Menu";
import {
    GET_OPTIONS,
    GET_TAXONOMIES,
    GET_PAGE_NAMES
} from "../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";

//import Theme from "../components/settings/Theme";

const SubmitBtn = ({ handleClick }) => {
    return (
        <button
            type="submit"
            onClick={handleClick}
            className="btn btn-blue btn-sm"
        >
            Save
        </button>
    );
};

class Settings extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = {};
        this.submitData = this.submitData.bind(this);
    }

    updateOption(option, value) {
        this.updatedOptions[option] = value;
    }

    submitData(e) {
        e.preventDefault();
        let settings = [];
        for (let option in this.updatedOptions) {
            settings.push({
                option: option,
                value: this.updatedOptions[option]
            });
        }
        this.props.updateOptions(settings).then(res => {
            console.log(res);
        });
    }
    render() {
        let data = {};
        if (this.props.options.loading) {
            return <div>hello</div>;
        }
        this.props.options.settings.map(setting => {
            data[setting.option] = setting;
        });

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">General Settings</div>
                    <div className="module-subtitle">
                        Overview of configuration options for your site.
                    </div>
                    <General
                        data={data}
                        updateOption={this.updateOption.bind(this)}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                <div className="card">
                    <div className="module-title">Social Settings</div>
                    <div className="module-subtitle">
                        Setup your social links
                    </div>
                    <Social
                        data={data}
                        updateOption={this.updateOption.bind(this)}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                <div className="card">
                    <div className="module-title">Sidebar Settings</div>
                    <div className="module-subtitle">
                        Configure your sidebar widgets
                    </div>
                    <Sidebar
                        data={data}
                        updateOption={this.updateOption.bind(this)}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                <div className="card">
                    <div className="module-title">Menu Settings</div>
                    <div className="module-subtitle">Configure your menu</div>
                    <Menu
                        data={data}
                        pages={this.props.pages}
                        categories={this.props.categories.taxonomies}
                        updateOption={this.updateOption.bind(this)}
                    />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                {/* <div className="card">
                        <div className="module-title">Sidebar Settings</div>
                        <div className="module-subtitle">
                            Configure your sidebar widgets
                        </div>
                        <Theme
                            data={data}
                            updateOption={this.updateOption.bind(this)}
                        />
                    </div> */}
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
    options: props => ({ variables: { type: "page" } })
});
const Data = compose(ContainerWithData, CategoriesData, PagesData);

const createQueryWithData = graphql(UPDATE_OPTIONS, {
    props: ({ mutate }) => {
        return {
            updateOptions: data => {
                return mutate({
                    variables: { options: data },
                    updateQueries: {
                        getOptions: (prev, { mutationResult }) => {
                            return {
                                post: {
                                    ...prev.settings,
                                    ...mutationResult.data.updateOptions
                                }
                            };
                        }
                    }
                });
            }
        };
    }
});

export default createQueryWithData(Data(Settings));
