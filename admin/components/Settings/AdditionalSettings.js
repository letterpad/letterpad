import React, { Component } from "react";
import PropTypes from "prop-types";

export default class AdditionalSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayAuthor: JSON.parse(this.props.data.displayAuthorInfo.value)
        };
        this.changeAuthorDisplay = this.changeAuthorDisplay.bind(this);
        this.updateOption = this.updateOption.bind(this);
    }
    changeAuthorDisplay(e) {
        this.setState(
            {
                displayAuthor: e.target.checked
            },
            () => {
                this.updateOption(
                    "displayAuthorInfo",
                    JSON.stringify(this.state.displayAuthor)
                );
            }
        );
    }
    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        const { t } = this.context;
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.additional.disqus")}
                    </label>
                    <input
                        defaultValue={
                            this.props.data.sidebar_latest_post_count.value
                        }
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.additional.disqus.placeholder"
                        )}
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption(
                                "sidebar_latest_post_count",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.additional.aboutTitle")}
                    </label>
                    <textarea
                        defaultValue={this.props.data.sidebar_about.value}
                        className="form-control"
                        rows="2"
                        placeholder={t(
                            "settings.additional.aboutTitle.placeholder"
                        )}
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("sidebar_about", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <div className="switch-block">
                        <label className="custom-label">
                            {t("settings.additional.displayAuthor")}
                        </label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                onChange={this.changeAuthorDisplay}
                                checked={this.state.displayAuthor}
                            />
                            <span className="slider round" />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.additional.disqus")}
                    </label>
                    <input
                        defaultValue={this.props.data.disqus_id.value}
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.additional.disqus.placeholder"
                        )}
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("disqus_id", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}
AdditionalSettings.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
AdditionalSettings.contextTypes = {
    t: PropTypes.func
};
