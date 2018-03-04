import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Basic extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        const { t } = this.context;
        return (
            <div>
                <div className="module-title">{t("profile.basic.title")}</div>
                <div className="module-subtitle">
                    {t("profile.basic.tagline")}
                </div>
                <div className="form-group">
                    <label className="custom-label">{t("common.fname")}</label>
                    <input
                        defaultValue={this.props.data.fname}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.fname.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("fname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label"> {t("common.lname")}</label>
                    <input
                        defaultValue={this.props.data.lname}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.lname.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("lname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label"> {t("common.ename")}</label>
                    <input
                        defaultValue={this.props.data.email}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.email.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("email", e.target.value)}
                    />
                </div>
            </div>
        );
    }
}
Basic.contextTypes = {
    t: PropTypes.func
};
