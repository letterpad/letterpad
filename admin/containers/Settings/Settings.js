import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import StackGrid from "react-stack-grid";
import {
    General,
    Social,
    AdditionalSettings,
    Messages
} from "../../components/Settings";
import { GET_OPTIONS, GET_TAXONOMIES } from "../../../shared/queries/Queries";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";
import { notify } from "react-notify-toast";

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
        document.body.classList.add("settings-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("settings-page");
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
            notify.show("Site settings saved", "success", 3000);
        });
    }
    render() {
        const data = {};
        const { t } = this.context;
        if (this.props.options.loading) {
            return <div>hello</div>;
        }
        this.props.options.settings.forEach(setting => {
            data[setting.option] = setting;
        });

        return (
            <section className="module-xs">
                <StackGrid
                    className="post-grid with-padding"
                    columnWidth={"50%"}
                    gutterWidth={12}
                    gutterHeight={12}
                    duration={0}
                >
                    <div className="card">
                        <div className="module-title">
                            {t("settings.general.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.general.tagline")}
                        </div>
                        <General data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card">
                        <div className="module-title">
                            {t("settings.social.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.social.tagline")}
                        </div>
                        <Social data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card">
                        <div className="module-title">
                            {t("settings.additional.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.additional.tagline")}
                        </div>
                        <AdditionalSettings
                            data={data}
                            updateOption={this.setOption}
                        />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card">
                        <div className="module-title">
                            {t("settings.messages.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.messages.tagline")}
                        </div>
                        <Messages data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                </StackGrid>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_OPTIONS, {
    name: "options"
});

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

Settings.contextTypes = {
    t: PropTypes.func
};

export default createQueryWithData(ContainerWithData(Settings));
