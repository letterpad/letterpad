import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";
import StyledSection from "../../components/section";

import Loader from "admin/components/loader";

import { GET_OPTIONS } from "../../../shared/queries/Queries";
import UpdateOptions from "../../data-connectors/UpdateOptions";
import CreateStatic from "./CreateStatic";

class StaticSite extends Component {
  sendRequest = url => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.token,
      },
    };
    return fetch(url, options).then(res => {
      return res.body.getReader();
    });
  };

  updateOption = (option, value) => {
    const settings = [{ option, value }];
    this.props.updateOptions(settings).then(() => {
      notify.show("Site settings saved", "success", 3000);
    });
  };

  chunkToJSON = chunk => {
    return JSON.parse(
      String.fromCharCode.apply(null, new Uint8Array(chunk.buffer)).trim(),
    );
  };

  render() {
    const { options } = this.props;
    if (options.loading) {
      return <Loader />;
    }
    const data = {};
    options.settings.forEach(setting => {
      data[setting.option] = setting;
    });

    return (
      <StyledSection>
        <div>
          <CreateStatic
            updateOption={this.updateOption}
            sendRequest={this.sendRequest}
            chunkToJSON={this.chunkToJSON}
            data={data}
          />
        </div>
      </StyledSection>
    );
  }
}

StaticSite.propTypes = {
  data: PropTypes.object,
  updateOptions: PropTypes.func,
  t: PropTypes.func,
  options: PropTypes.object,
};

StaticSite.defaultPropTypes = {
  data: JSON.stringify({
    text_notfound: "",
  }),
};

const OptionsData = graphql(GET_OPTIONS, {
  name: "options",
});

export default translate("translations")(
  UpdateOptions(OptionsData(StaticSite)),
);
