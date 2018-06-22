import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Social extends Component {
    static propTypes = {
        data: PropTypes.string,
        updateOption: PropTypes.func
    };

    static defaultProps = {
        data: JSON.stringify({
            twitter: "",
            github: "",
            instagram: "",
            facebook: ""
        })
    };

    static contextTypes = {
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            social: {}
        };
        this.updateOption = this.updateOption.bind(this);
    }
    componentWillMount() {
        this.setState({
            social: JSON.parse(this.props.data)
        });
    }

    updateOption(option, value) {
        let newState = { social: { ...this.state.social } };
        newState.social[option] = value;
        this.setState(newState);
        this.props.updateOption("social", JSON.stringify(newState.social));
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
                        value={this.state.social.facebook}
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
                        value={this.state.social.instagram}
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
