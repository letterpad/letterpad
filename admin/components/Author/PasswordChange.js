import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

class PasswordChange extends Component {
    static propTypes = {
        updateOption: PropTypes.func,
        t: PropTypes.func
    };

    updateOption = (option, value) => {
        this.props.updateOption("password", value);
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="module-title">
                    {t("profile.password.title")}
                </div>
                <div className="module-subtitle">
                    {t("profile.password.tagline")}
                </div>

                <div className="form-group">
                    <label className="custom-label">
                        {t("profile.password.label")}
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder={t("profile.password.placeholder")}
                        aria-invalid="false"
                        onChange={e =>
                            this.updateOption("password", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}

export default translate("translations")(PasswordChange);
