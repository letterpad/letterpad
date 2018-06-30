import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Social extends Component {
    updateOption = (option, value) => {
        this.props.updateOption(option, value);
    }
    render() {
        const { t } = this.context;
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">{t("common.github")}</label>
                    <input
                        defaultValue={this.props.data.social_github.value}
                        type="text"
                        className="form-control"
                        placeholder={t("social.gh.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("social_github", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("common.facebook")}
                    </label>
                    <input
                        defaultValue={this.props.data.social_facebook.value}
                        type="text"
                        className="form-control"
                        placeholder={t("social.fb.placeholder")}
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("social_facebook", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("common.twitter")}
                    </label>
                    <input
                        defaultValue={this.props.data.social_twitter.value}
                        type="text"
                        className="form-control"
                        placeholder={t("social.twitter.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("social_twitter", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("common.instagram")}
                    </label>
                    <input
                        defaultValue={this.props.data.social_instagram.value}
                        type="text"
                        className="form-control"
                        placeholder={t("social.ig.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption(
                                "social_instagram",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>
        );
    }
}

Social.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
Social.defaultPropTypes = {
    data: JSON.stringify({
        social_twitter: "",
        social_instagram: "",
        social_facebook: "",
        social_github: ""
    })
};

Social.contextTypes = {
    t: PropTypes.func
};
