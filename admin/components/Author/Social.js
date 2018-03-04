import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            social: {}
        };
        this.updateOption = this.updateOption.bind(this);
    }
    componentWillMount() {
        this.state.social = JSON.parse(this.props.data);
        this.setState(this.state);
    }

    updateOption(option, value) {
        this.state.social[option] = value;
        this.setState(this.state);
        this.props.updateOption("social", JSON.stringify(this.state.social));
    }
    render() {
        const { t } = this.context;
        return (
            <div>
                <div className="module-title">{t("social.title")}</div>
                <div className="module-subtitle">{t("social.tagline")}</div>
                <div className="form-group">
                    <label className="custom-label">Twitter</label>
                    <input
                        value={this.state.social.twitter}
                        type="text"
                        className="form-control"
                        placeholder={t("social.twitter.placeholder")}
                        onChange={e =>
                            this.updateOption("twitter", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Facebook</label>
                    <input
                        value={this.state.social.twitter}
                        type="text"
                        className="form-control"
                        placeholder={t("social.fb.placeholder")}
                        onChange={e =>
                            this.updateOption("facebook", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Instagram</label>
                    <input
                        value={this.state.social.twitter}
                        type="text"
                        className="form-control"
                        placeholder={t("social.ig.placeholder")}
                        onChange={e =>
                            this.updateOption("instagram", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Github</label>
                    <input
                        value={this.state.social.github}
                        type="text"
                        className="form-control"
                        placeholder={t("social.gh.placeholder")}
                        onChange={e =>
                            this.updateOption("github", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}

Social.propTypes = {
    data: PropTypes.string,
    updateOption: PropTypes.func
};

Social.defaultProps = {
    data: JSON.stringify({
        twitter: "",
        github: "",
        instagram: "",
        facebook: ""
    })
};

Social.contextTypes = {
    t: PropTypes.func
};
