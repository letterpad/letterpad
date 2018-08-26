import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Input from "../../components/input";

class Optional extends Component {
    state = {
        displayAuthor: JSON.parse(this.props.data.displayAuthorInfo.value)
    };

    changeAuthorDisplay = e => {
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
    };

    updateOption = (option, value) => {
        this.props.updateOption(option, value);
    };

    render() {
        const { t } = this.props;
        return (
            <div>
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

                <Input
                    label={t("settings.additional.disqus")}
                    defaultValue={this.props.data.disqus_id.value}
                    type="text"
                    placeholder={t("settings.additional.disqus.placeholder")}
                    onBlur={e => this.updateOption("disqus_id", e.target.value)}
                />
            </div>
        );
    }
}

Optional.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func,
    t: PropTypes.func
};

export default translate("translations")(Optional);
