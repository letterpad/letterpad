import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import UpdateOptions from "../../data-connectors/UpdateOptions";
import SettingsData from "shared/data-connectors/SettingsData";
import { makeUrl } from "shared/util";
import ThemeItem from "../../components/Settings/ThemeItem";

class Themes extends Component {
    static propTypes = {
        updateOptions: PropTypes.func,
        options: PropTypes.object
    };

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

        document.body.classList.add("themes-page");
    }

    componentDidMount() {
        this.getThemes();
    }

    componentWillUnmount() {
        document.body.classList.remove("themes-page");
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.settings.loading) {
            return false;
        }
        const data = nextProps.settings.data;
        const { css, theme } = data;

        return {
            css: css.value,
            theme: theme.value
        };
    }

    getThemes() {
        const url = makeUrl("/admin/getThemes");
        fetch(url)
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
        this.props.updateOptions(settings).then(() => {
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
                        {this.state.themes.map((theme, idx) => (
                            <ThemeItem
                                key={idx}
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

export default SettingsData(UpdateOptions(Themes));
