import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import General from "../components/settings/General";
import Social from "../components/settings/Social";
import Sidebar from "../components/settings/Sidebar";
import Menu from "../components/settings/Menu";

//import Theme from "../components/settings/Theme";

const SubmitBtn = ({ handleClick }) => {
    return (
        <button
            type="submit"
            onClick={handleClick}
            className="btn btn-dark btn-md"
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
    clicked(e) {
        e.preventDefault();
        let collapsed = e.target.getAttribute("class");
        e.target.setAttribute("class", collapsed == "" ? "collapsed" : "");

        //open drawer
        let href = e.target.getAttribute("href");
        let $ele = document.getElementById(href);
        if (collapsed == "") {
            //open
            $ele.classList.remove("in");
        } else {
            //close
            $ele.classList.add("in");
        }
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
        this.props.updateOptions(settings);
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
            <div className="wrapper ">
                <section className="module-xs">
                    <div className="container-fluid">
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
                </section>
                <section className="module-xs">
                    <div className="container-fluid">
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
                </section>
                <section className="module-xs">
                    <div className="container-fluid">
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
                </section>
                <section className="module-xs">
                    <div className="container-fluid">
                        <div className="module-title">Menu Settings</div>
                        <div className="module-subtitle">
                            Configure your menu
                        </div>
                        <Menu
                            data={data}
                            pages={this.props.pages}
                            categories={this.props.categories.taxonomies}
                            updateOption={this.updateOption.bind(this)}
                        />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                </section>
                {/* <section className="module-xs">
                    <div className="container-fluid">
                        <div className="module-title">Sidebar Settings</div>
                        <div className="module-subtitle">
                            Configure your sidebar widgets
                        </div>
                        <Theme
                            data={data}
                            updateOption={this.updateOption.bind(this)}
                        />
                    </div>
                </section> */}
            </div>
        );
    }
}
const optionsQuery = gql`
    query getOptions {
        settings {
            id
            option
            value
        }
    }
`;

const ContainerWithData = graphql(optionsQuery, {
    name: "options"
});

const CategoriesQuery = gql`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;
const CategoriesData = graphql(CategoriesQuery, {
    name: "categories",
    options: { variables: { type: "post_category" } }
});

const PagesQuery = gql`
    query getPosts($type: String!) {
        posts(type: $type) {
            count
            rows {
                id
                title
            }
        }
    }
`;

const PagesData = graphql(PagesQuery, {
    name: "pages",
    options: props => ({ variables: { type: "page" } })
});
const Data = compose(ContainerWithData, CategoriesData, PagesData);

const mutateOptions = gql`
    mutation updateOptions($options: [OptionInputType]) {
        updateOptions(options: $options) {
            id
            option
            value
        }
    }
`;
const createQueryWithData = graphql(mutateOptions, {
    props: ({ mutate }) => {
        return {
            updateOptions: data => {
                mutate({
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
