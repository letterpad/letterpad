import { ProgressText, Spinner } from "./index.css";
import React, { Component } from "react";

import Button from "../../components/button";
import Link from "../../components/link";
import PropTypes from "prop-types";
import StyledCard from "../../components/card";
import StyledSection from "../../components/section";
import config from "../../../config";
import { translate } from "react-i18next";

class CreatePr extends Component {
  state = {
    creatingPr: false,
  };

  pullRequestStatus = React.createRef();

  createPullRequest = async () => {
    this.setState({ creatingPr: true });
    this.pullRequestStatus.current.textContent = "";
    const pointer = "<span style='color: var(--color-base)'>-</span>";
    const reader = await this.props.sendRequest(
      `${config.baseName}/admin/create-pull-request`,
    );

    const readStream = reader => {
      return reader.read().then(result => {
        if (result.done) {
          return this.setProgressWidth();
        }
        const chunk = result.value;
        // read the response
        const { message } = this.props.chunkToJSON(chunk);
        if (message === "done") {
          this.pullRequestStatus.current.innerHTML += `<br> ${pointer} All Done!`;
          this.setState({ creatingPr: false });
          return reader.cancel();
        }
        this.pullRequestStatus.current.innerHTML +=
          `<br> ${pointer} ` + message;
        return readStream(reader);
      });
    };
    readStream(reader);
  };

  render() {
    return (
      <StyledSection>
        <div>
          <StyledCard
            title="Create a Pull Request"
            subtitle="Use github to version your website"
          >
            We use the hub library to create a pull request. This is not
            installed by letterpad.{" "}
            <Link
              to="https://github.com/github/hub"
              rel="noopener noreferrer"
              target="_blank"
            >
              Click here
            </Link>{" "}
            for installation instructions.
            <br />
            <br />
            Github Repository: <strong />
            <br />
            <br />
            <small>(Make sure that the Github Repository exist)</small>
            <ProgressText>
              <br />
              {this.state.creatingPr && <Spinner />}
              <span ref={this.pullRequestStatus} />
            </ProgressText>
            <br />
            <Button success sm onClick={this.createPullRequest}>
              Create PR
            </Button>
          </StyledCard>
        </div>
      </StyledSection>
    );
  }
}

CreatePr.propTypes = {
  data: PropTypes.object,
  updateOption: PropTypes.func,
  chunkToJSON: PropTypes.func,
  sendRequest: PropTypes.func,
  t: PropTypes.func,
  options: PropTypes.object,
};

CreatePr.defaultPropTypes = {
  data: JSON.stringify({
    text_notfound: "",
  }),
};

export default translate("translations")(CreatePr);
