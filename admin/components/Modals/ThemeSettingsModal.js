import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import ModalHoc from "../../components/ModalHoc";
import { InputBox, RadioBox, SelectBox, CheckBox } from "../FormBuilder";

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
        const { t, data } = this.props;

        const settings = JSON.parse(data.settings);
        const value = JSON.parse(data.value);
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
                                <InputBox
                                    key={ui.short_name}
                                    data={ui}
                                    onChange={this.getChangedValues}
                                />
                            );
                        case "radio":
                            return (
                                <RadioBox
                                    key={ui.short_name}
                                    data={ui}
                                    onChange={this.getChangedValues}
                                />
                            );
                        case "checkbox":
                            return (
                                <CheckBox
                                    key={ui.short_name}
                                    data={ui}
                                    onChange={this.getChangedValues}
                                />
                            );
                    }
                    break;
                case "select":
                    return (
                        <SelectBox
                            key={ui.short_name}
                            data={ui}
                            onChange={this.getChangedValues}
                        />
                    );
                default:
                    return <div key={ui.short_name} />;
            }
        });

        return (
            <React.Fragment>
                <div className="modal-header">
                    <button onClick={this.props.onClose} className="close">
                        ×
                    </button>
                    <h4
                        className="modal-title"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingRight: 26
                        }}
                    >
                        <span>Theme settings - {data.name}</span>
                    </h4>
                </div>
                <div className="modal-body">
                    {themeSettings}
                    <div className="p-t-20" />
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-xs btn-dark"
                        onClick={this.onSave}
                    >
                        {t("common.save")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-xs btn-default"
                        onClick={this.props.onClose}
                    >
                        {t("common.cancel")}
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default translate("translations")(ModalHoc(ThemeSettingsModal, null));
