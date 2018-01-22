import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import General from "../components/settings/General";
import Social from "../components/settings/Social";
import SidebarWidgets from "../components/settings/SidebarWidgets";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import { GET_OPTIONS, GET_TAXONOMIES } from "../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";
import Button from "material-ui/Button";
import PageHeader from "../components/PageHeader";

//import Theme from "../components/settings/Theme";

const SubmitBtn = ({ handleClick }) => (
    <CardActions>
        <Button raised color="primary" onClick={handleClick}>
            Save
        </Button>
    </CardActions>
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
            <div>
                <PageHeader
                    title="Site Settings"
                    subtitle="Control site wide specific settings and customizations from here."
                />
                <CardContent>
                    <div className="row">
                        <div className="col-lg-6">
                            <Card>
                                <CardHeader
                                    title="General Settings"
                                    subheader="Overview of configuration options for your site."
                                />
                                <CardContent>
                                    <General
                                        data={data}
                                        updateOption={this.setOption}
                                    />
                                    <SubmitBtn handleClick={this.submitData} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-lg-6">
                            <Card>
                                <CardHeader
                                    title="Social Settings"
                                    subheader="Setup your social links"
                                />
                                <CardContent>
                                    <Social
                                        data={data}
                                        updateOption={this.setOption}
                                    />
                                    <SubmitBtn handleClick={this.submitData} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-lg-6">
                            <Card>
                                <CardHeader
                                    title="Sidebar Settings"
                                    subheader="Configure your sidebar widgets"
                                />
                                <CardContent>
                                    <SidebarWidgets
                                        data={data}
                                        updateOption={this.setOption}
                                    />
                                    <SubmitBtn handleClick={this.submitData} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </div>
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
