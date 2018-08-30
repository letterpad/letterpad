import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import ModalHoc from "../../components/modal";
import StyledButton from "../../components/button";

import StyledInput from "../../components/input";
import StyledCheckbox from "../../components/checkbox";
import StyledRadioBox from "../../components/radio";
import StyledSelect from "../../components/select";

class ThemeSettingsModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        data: PropTypes.object,
        t: PropTypes.func
    };

    state = {
        changedValues: {}
    };

    // On every input change, this function will be called
    getChangedValues = (field, newValue) => {
        // update the state with the changed values
        this.setState({
            changedValues: {
                ...this.state.changedValues,
                [field]: newValue
            }
        });
    };

    // On save, merge the new values with the old values.
    onSave = () => {
        const oldValue = JSON.parse(this.props.data.value);
        const data = {
            ...oldValue,
            ...this.state.changedValues
        };
        // save this data
        this.props.onSave(data);
    };

    render() {
        let {
            t,
            data: { name, settings, value }
        } = this.props;

        settings = JSON.parse(settings);
        value = JSON.parse(value);
        /**
         * Parse the json data and build the UI
         */
        const themeSettings = settings.map(ui => {
            ui.defaultValue = value[ui.name];
            switch (ui.tag) {
                case "input":
                    switch (ui.type) {
                        case "text":
                            return (
                                <StyledInput
                                    label={ui.label}
                                    key={ui.short_name}
                                    data={ui}
                                    value={ui.defaultValue}
                                    onBlur={e =>
                                        this.getChangedValues(
                                            ui.name,
                                            e.target.value
                                        )
                                    }
                                />
                            );
                        case "radio":
                            return (
                                <StyledRadioBox
                                    key={ui.short_name}
                                    data={ui}
                                    onChange={this.getChangedValues}
                                />
                            );
                        case "checkbox":
                            return (
                                <StyledCheckbox
                                    key={ui.short_name}
                                    data={ui}
                                    onChange={this.getChangedValues}
                                />
                            );
                    }
                    break;
                case "select":
                    return (
                        <StyledSelect
                            block
                            bold
                            label={ui.label}
                            key={ui.short_name}
                            options={ui.options.map(option => {
                                return { value: option, name: option };
                            })}
                            selected={ui.defaultValue}
                            onChange={value =>
                                this.getChangedValues(ui.name, value)
                            }
                        />
                    );
                default:
                    return <div key={ui.short_name} />;
            }
        });

        return (
            <ModalHoc
                confirm
                title={<span>Theme settings - {name}</span>}
                onClose={this.props.onClose}
            >
                <div className="modal-body">
                    {themeSettings}
                    <div className="p-t-20" />
                </div>
                <div className="modal-footer">
                    <StyledButton type="button" onClick={this.props.onClose}>
                        {t("common.cancel")}
                    </StyledButton>
                    <StyledButton type="button" success onClick={this.onSave}>
                        {t("common.save")}
                    </StyledButton>
                </div>
            </ModalHoc>
        );
    }
}

export default translate("translations")(ThemeSettingsModal);
