import React, { useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../../components/button";
import CheckBox from "../../../components/checkbox";
import Input from "../../../components/input";
import ModalHoc from "../../../components/modal";
import RadioBox from "../../../components/radio";
import StyledSelect from "../../../components/select";
import { ThemeSettings } from "../../../../__generated__/gqlTypes";

interface IProps extends WithNamespaces {
  onClose: () => void;
  onSave: (data: ThemeSettings[]) => void;
  data: ThemeSettings[];
  name: string;
}

const ThemeSettingsModal: React.FC<IProps> = props => {
  const { onClose, onSave, data, t, name } = props;
  const [change, setChange] = useState<{}>({});

  // On every input change, this function will be called
  const getChangedValues = (field, newValue) => {
    // update the state with the changed values
    setChange({
      ...change,
      [field]: newValue,
    });
  };

  // On save, merge the new values with the old values.
  const actionSave = () => {
    const newData = data.map(item => {
      const newChangedValue = change[item.name];
      const { __typename, ...itemWithoutTypeName } = item;
      if (newChangedValue) {
        itemWithoutTypeName.changedValue = newChangedValue;
        if (Array.isArray(newChangedValue)) {
          itemWithoutTypeName.changedValue = newChangedValue.join("|");
        }
      }
      return itemWithoutTypeName;
    });

    // save this data
    onSave(newData);
  };

  /**
   * Parse the json data and build the UI
   */
  const themeSettings = data.map((ui, idx) => {
    switch (ui.tag) {
      case "input":
        switch (ui.type) {
          case "text":
            return (
              <div>
                <Input
                  label={ui.label}
                  key={idx}
                  value={ui.changedValue || ui.defaultValue || ""}
                  onBlur={e => getChangedValues(ui.name, e.target.value)}
                />
                <br />
              </div>
            );
          case "radio":
            return (
              <div>
                <RadioBox
                  defaultValue={ui.changedValue || ui.defaultValue}
                  label={ui.label}
                  options={ui.options}
                  key={idx}
                  onChange={(selected: string) =>
                    getChangedValues(ui.name, selected)
                  }
                />
                <br />
              </div>
            );
          case "checkbox":
            return (
              <div>
                <CheckBox
                  label={ui.label}
                  defaultValue={
                    ui.changedValue?.split("|") || ui.defaultValue?.split("|")
                  }
                  key={idx}
                  for={ui.name}
                  options={ui.options}
                  onChange={selected => getChangedValues(ui.name, selected)}
                />
                <br />
              </div>
            );
        }
        break;
      case "select":
        if (!ui.options) break;
        return (
          <div>
            <StyledSelect
              block
              bold
              label={ui.label}
              key={idx}
              options={ui.options.map(option => {
                return { value: option, name: option };
              })}
              selected={ui.changedValue || ui.defaultValue}
              onChange={value => getChangedValues(ui.name, value)}
            />
            <br />
            <br />
          </div>
        );
      default:
        return <div key={idx} />;
    }
  });

  return (
    <ModalHoc
      confirm
      title={<span>Theme settings - {name}</span>}
      onClose={onClose}
    >
      <div className="modal-body">
        {themeSettings}
        <div className="p-t-20" />
      </div>
      <div className="modal-footer">
        <Button type="button" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button type="button" success onClick={actionSave}>
          {t("common.save")}
        </Button>
      </div>
    </ModalHoc>
  );
};

export default translate("translations")(ThemeSettingsModal);
