import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
// import FontPicker from "font-picker-react";
import { ChromePicker } from "react-color";
import { notify } from "react-notify-toast";
import UpdateOptions from "../../data-connectors/UpdateOptions";
import SettingsData from "../../../shared/data-connectors/SettingsData";
import config from "../../../config";

class ThemeItem extends Component {
    render() {
        const theme = this.props.theme;
        return (
            <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <article
                    className={"theme-item" + (theme.active ? " active" : "")}
                >
                    <div className="theme-thumbnail">
                        <img className="theme-image" src={theme.thumbnail} />
                    </div>
                    <div className="theme-body with-border">
                        <div className="theme-header">
                            <div className="theme-name">
                                {theme.name} by {theme.author}
                            </div>
                            <div className="theme-meta">
                                {theme.description}
                            </div>
                            {theme.active && (
                                <span className="label label-info">active</span>
                            )}
                            {!theme.active && (
                                <Link
                                    to="#"
                                    onClick={e =>
                                        this.props.activateTheme(
                                            e,
                                            this.props.theme
                                        )
                                    }
                                >
                                    Activate
                                </Link>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

class Themes extends Component {
    constructor(props) {
        super(props);
        this.updatedOptions = {};
        this.submitData = this.submitData.bind(this);
        this.setOption = this.setOption.bind(this);
        this.handleCssChange = this.handleCssChange.bind(this);
        this.state = {
            css: "",
            themes: []
        };
        this.bc = new BroadcastChannel("test_channel");
        this.bcTrottleTimout = null;

        document.body.classList.add("themes-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("themes-page");
    }

    componentDidMount() {
        this.getThemes();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.settings.loading) {
            return false;
        }
        const data = nextProps.settings.data;
        const { css, theme } = data;

        this.setState({
            css: css.value,
            theme: theme.value
        });
    }

    getThemes() {
        fetch(config.rootUrl + "/admin/getThemes")
            .then(res => res.json())
            .then(themes => {
                this.setState({ themes });
            });
    }

    handleCssChange(e) {
        const css = e.target.value;
        this.setState({ css });
        this.updatedOptions.css = css;
    }

    setOption(option, value) {
        this.updatedOptions[option] = value;
    }

    submitData(e) {
        e.preventDefault();
        const settings = [];
        Object.keys(this.updatedOptions).forEach(option => {
            let value = this.updatedOptions[option];
            settings.push({
                option,
                value
            });
        });
        this.props.updateOptions(settings).then(res => {
            this.getThemes();
            notify.show("Theme settings saved", "success", 3000);
        });
    }
    activateTheme(e, theme) {
        e.preventDefault();
        const modifiedThemes = this.state.themes.map(items => {
            items.active = false;
            if (theme.name === items.name) {
                items.active = true;
            }
            return items;
        });
        this.setState({
            themes: modifiedThemes
        });
        this.updatedOptions.theme = theme.name;
    }

    render() {
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Theme Settings</div>
                    <div className="module-subtitle">
                        You can configure your theme.
                    </div>
                </div>
                <div className="card">
                    {/* <FontPicker
                        apiKey="AIzaSyAOkdDlx49HCSBdu86oe8AD1Q7piIxlR6k" // Google API key
                        defaultFont={"Open Sans"}
                        options={{ limit: 50 }}
                        onChange={e => {
                            console.log(e);
                        }}
                    />*/}
                    <textarea
                        className="form-control"
                        rows="7"
                        placeholder="Additional CSS"
                        aria-invalid="false"
                        onChange={this.handleCssChange}
                    />
                </div>
                <div className="card">
                    <div className="module-title">Select theme</div>
                    <div className="module-subtitle">
                        Browse your themes here
                    </div>
                    <div className="row">
                        {this.state.themes.map(theme => (
                            <ThemeItem
                                theme={theme}
                                activateTheme={this.activateTheme.bind(this)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    className="btn btn-blue btn-sm m-t-20"
                    onClick={this.submitData}
                >
                    Submit
                </button>
            </section>
        );
    }
}

Themes.propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object
};
export default SettingsData(UpdateOptions(Themes));
