import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import General from "../components/settings/General";
import Social from "../components/settings/Social";
import Sidebar from "../components/settings/Sidebar";
import Menu from "../components/settings/Menu";
//import Theme from "../components/settings/Theme";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = {};
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
            <div className={"wrapper "}>
                <section className="module-xs">
                    <div className="container-fluid container-custom">
                        <form id="contact-form" role="form" noValidate="">
                            <div id="accordion" className="panel-group">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a
                                                data-toggle="collapse"
                                                data-parent="#accordion"
                                                href="general"
                                                aria-expanded="false"
                                                className="collapsed"
                                                onClick={this.clicked.bind(
                                                    this
                                                )}
                                            >
                                                General
                                            </a>
                                        </h4>
                                    </div>
                                    <div
                                        id="general"
                                        className="panel-collapse collapse"
                                        aria-expanded="false"
                                    >
                                        <div className="panel-body">
                                            <General
                                                data={data}
                                                updateOption={this.updateOption.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a
                                                data-toggle="collapse"
                                                data-parent="#accordion"
                                                href="social"
                                                className="collapsed"
                                                aria-expanded="false"
                                                onClick={this.clicked.bind(
                                                    this
                                                )}
                                            >
                                                Social
                                            </a>
                                        </h4>
                                    </div>
                                    <div
                                        id="social"
                                        className="panel-collapse collapse"
                                        aria-expanded="false"
                                    >
                                        <div className="panel-body">
                                            <Social
                                                data={data}
                                                updateOption={this.updateOption.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a
                                                data-toggle="collapse"
                                                data-parent="#accordion"
                                                href="sidebar-options"
                                                className="collapsed"
                                                aria-expanded="false"
                                                onClick={this.clicked.bind(
                                                    this
                                                )}
                                            >
                                                Sidebar
                                            </a>
                                        </h4>
                                    </div>
                                    <div
                                        id="sidebar-options"
                                        className="panel-collapse collapse"
                                        aria-expanded="false"
                                    >
                                        <div className="panel-body">
                                            <Sidebar
                                                data={data}
                                                updateOption={this.updateOption.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a
                                                data-toggle="collapse"
                                                data-parent="#accordion"
                                                href="menu"
                                                className="collapsed"
                                                aria-expanded="false"
                                                onClick={this.clicked.bind(
                                                    this
                                                )}
                                            >
                                                Menu
                                            </a>
                                        </h4>
                                    </div>
                                    <div
                                        id="menu"
                                        className="panel-collapse collapse"
                                        aria-expanded="false"
                                    >
                                        <div className="panel-body">
                                            <Menu
                                                data={data}
                                                categories={
                                                    this.props.categories.taxonomies
                                                }
                                                updateOption={this.updateOption.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a
                                        data-toggle="collapse"
                                        data-parent="#accordion"
                                        href="theme"
                                        className="collapsed"
                                        aria-expanded="false"
                                        onClick={this.clicked.bind(this)}
                                    >
                                        Theme
                                    </a>
                                </h4>
                            </div>
                            <div
                                id="theme"
                                className="panel-collapse collapse"
                                aria-expanded="false"
                            >
                                <div className="panel-body">
                                    <Theme
                                        data={data}
                                        updateOption={this.updateOption.bind(
                                            this
                                        )}
                                    />
                                </div>
                            </div>
                        </div>*/
                                }
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    onClick={this.submitData.bind(this)}
                                    className="btn btn-block btn-round btn-dark"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
}
const optionsQuery = gql`
  query getOptions {
  settings {
    id,
    option,
    value
  }
}
`;

const ContainerWithData = graphql(optionsQuery, {
    name: "options"
});

const CategoriesQuery = gql`
  query getTaxonomies($type: String!) {
  taxonomies(type:$type) {
    id,
    name
  }
}
`;
const CategoriesData = graphql(CategoriesQuery, {
    name: "categories",
    options: { variables: { type: "post_category" } }
});

const Data = compose(ContainerWithData, CategoriesData);

const mutateOptions = gql`
  mutation updateOptions($options:[OptionInputType]) {
    updateOptions(options:$options) {
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
