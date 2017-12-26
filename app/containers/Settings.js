import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import General from "../components/settings/General";
import Social from "../components/settings/Social";
import SidebarWidgets from "../components/settings/SidebarWidgets";

import { GET_OPTIONS, GET_TAXONOMIES } from "../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";

//import Theme from "../components/settings/Theme";

const SubmitBtn = ({ handleClick }) => (
    <button type="submit" onClick={handleClick} className="btn btn-blue btn-sm">
        Save
    </button>
);
SubmitBtn.propTypes = {
    handleClick: PropTypes.func
};

class Settings extends Component {
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
        Object.keys(this.updatedOptions).forEach(option => {
            settings.push({
                option,
                value: this.updatedOptions[option]
            });
        });
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
                    <div className="module-title">General Settings</div>
                    <div className="module-subtitle">
                        Overview of configuration options for your site.
                    </div>
                    <General data={data} updateOption={this.setOption} />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                <div className="card">
                    <div className="module-title">Social Settings</div>
                    <div className="module-subtitle">
                        Setup your social links
                    </div>
                    <Social data={data} updateOption={this.setOption} />
                    <SubmitBtn handleClick={this.submitData} />
                </div>
                <div className="card">
                    <div className="module-title">Sidebar Settings</div>
                    <div className="module-subtitle">
                        Configure your sidebar widgets
                    </div>
                    <SidebarWidgets data={data} updateOption={this.setOption} />
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

const Data = compose(ContainerWithData, CategoriesData);

const createQueryWithData = graphql(UPDATE_OPTIONS, {
    props: ({ mutate }) => {
        return {
            updateOptions: data =>
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
                })
        };
    }
});
Settings.propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object
};
export default createQueryWithData(Data(Settings));
