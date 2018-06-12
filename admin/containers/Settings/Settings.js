import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import {
    General,
    Social,
    AdditionalSettings,
    Messages
} from "../../components/Settings";
import { GET_OPTIONS } from "../../../shared/queries/Queries";
import { notify } from "react-notify-toast";
import UpdateOptions from "../../data-connectors/UpdateOptions";

const SubmitBtn = ({ handleClick }) => (
    <button type="submit" onClick={handleClick} className="btn btn-blue btn-sm">
        Save
    </button>
);
SubmitBtn.propTypes = {
    handleClick: PropTypes.func
};

class Settings extends Component {
    static propTypes = {
        updateOptions: PropTypes.func,
        options: PropTypes.object
    };

    static contextTypes = {
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.updatedOptions = {};
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
        document.body.classList.add("settings-page");
    }
    componentDidMount() {
        const elem = document.querySelector(".masonry-grid");
        setTimeout(() => {
            new Masonry(elem, {
                itemSelector: ".masonry-grid-item",
                gutter: 10
            });
        }, 300);
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
        this.props.updateOptions(settings).then(() => {
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
                <div className="masonry-grid">
                    <div className="card masonry-grid-item">
                        <div className="module-title">
                            {t("settings.general.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.general.tagline")}
                        </div>
                        <General data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card masonry-grid-item">
                        <div className="module-title">
                            {t("settings.social.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.social.tagline")}
                        </div>
                        <Social data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                    <div className="card masonry-grid-item">
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
                    <div className="card masonry-grid-item">
                        <div className="module-title">
                            {t("settings.messages.title")}
                        </div>
                        <div className="module-subtitle">
                            {t("settings.messages.tagline")}
                        </div>
                        <Messages data={data} updateOption={this.setOption} />
                        <SubmitBtn handleClick={this.submitData} />
                    </div>
                </div>
            </section>
        );
    }
}

const OptionsData = graphql(GET_OPTIONS, {
    name: "options"
});
export default UpdateOptions(OptionsData(Settings));
