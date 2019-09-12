import React, { Component } from "react";
import { graphql } from "@apollo/react-hoc";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";

import Loader from "admin/components/loader";

import General from "./General";
import Social from "./Social";
import Optional from "./Optional";
import Messages from "./Messages";

import StyledSection from "../../components/section";
// import StyledCard from "../../components/card";
import StyledTitleHeader from "../../components/title-header";
import Button from "../../components/button";
import Tabs from "../../components/tabs";

import { GET_OPTIONS } from "../../../shared/queries/Queries";
import UpdateOptions from "../../data-connectors/UpdateOptions";

class Settings extends Component {
  static propTypes = {
    updateOptions: PropTypes.func,
    options: PropTypes.object,
    history: PropTypes.object,
    t: PropTypes.func,
  };

  state = {
    updatedOptions: {},
    selected:
      new URLSearchParams(this.props.history.location.search).get("tab") ||
      "general",
  };

  setOption = (option, value) => {
    const { updatedOptions } = this.state;
    updatedOptions[option] = value;
  };

  submitData = e => {
    e.preventDefault();
    const settings = [];
    Object.keys(this.state.updatedOptions).forEach(option => {
      settings.push({
        option,
        value: this.state.updatedOptions[option],
      });
    });

    this.props.updateOptions(settings).then(() => {
      notify.show("Site settings saved", "success", 3000);
    });
  };

  handleNavClick = page => {
    this.props.history.push({
      pathname: this.props.history.location.pathname,
      search: "?tab=" + page,
    });
  };

  render() {
    const { selected } = this.state;
    const { options, t } = this.props;
    const data = {};

    if (options.loading) {
      return <Loader />;
    }
    options.settings.forEach(setting => {
      data[setting.option] = setting;
    });

    return (
      <StyledSection>
        <Tabs activeTab={selected} onChange={this.handleNavClick}>
          <StyledTitleHeader
            title={t(`settings.${selected}.title`)}
            subtitle={t(`settings.${selected}.tagline`)}
          />

          <General label="general" data={data} updateOption={this.setOption} />
          <Social label="social" data={data} updateOption={this.setOption} />
          <Optional
            label="optional"
            data={data}
            updateOption={this.setOption}
          />
          <Messages
            label="messages"
            data={data}
            updateOption={this.setOption}
          />
          <br />
          <br />
          <Button success onClick={this.submitData}>
            Save
          </Button>
        </Tabs>
      </StyledSection>
    );
  }
}

const OptionsData = graphql(GET_OPTIONS, {
  name: "options",
});

export default translate("translations")(UpdateOptions(OptionsData(Settings)));
