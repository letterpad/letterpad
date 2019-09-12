import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledSection from "../../components/section";
import StyledCard from "../../components/card";
import Button from "../../components/button";

import config from "../../../config";

import { ProgressBar, Warning } from "./index.css";

class CreateStatic extends Component {
  state = {
    processingFiles: false,
  };

  progress = React.createRef();

  message = React.createRef();

  createStaticFiles = async () => {
    if (this.state.processingFiles) {
      return false;
    }
    this.setState({ processingFiles: true });
    const reader = await this.props.sendRequest(
      `${config.rootUrl + config.baseName}/admin/generate-static-site`,
    );

    let oldPercentage = 0;

    const readStream = reader => {
      return reader.read().then(result => {
        if (result.done) {
          return this.setProgressWidth();
        }
        const chunk = result.value;
        // new percentage received from server
        const { type, message } = this.props.chunkToJSON(chunk);
        if (type === "message") {
          this.message.current.innerHTML = message;
          return readStream(reader);
        }
        this.message.current.innerHTML = "";
        const newPercentage = message;
        // if the percentage is 100, find the difference between the this and last percentage.
        if (newPercentage === 100) {
          // check the prev percent. if it is more than 20 gracefully end
          let diff = parseInt(newPercentage) - oldPercentage;
          if (diff > 20) {
            this.progressGracefully(oldPercentage, () => {
              this.setState({ processingFiles: false });
              return reader.cancel();
            });
          } else {
            this.setState({ processingFiles: false });
            return reader.cancel();
          }
        } else {
          // set the progress bar with the new percentage
          this.setProgressWidth(newPercentage);
          // remember the last percentage received
          oldPercentage = parseInt(newPercentage);
          // continue reading the stream
          return readStream(reader);
        }
      });
    };

    // the server is going to send us the progress in chunks. The chunks are going to contain
    // either percentages(1,2, etc) or "error".
    // Sometimes the percentage might jump from 70% to 100%. So we calculate the difference
    // between last two percentages and end the progress bar gracefully.
    readStream(reader);
  };

  updateOption = (option, value) => {
    this.props.updateOptions([{ option, value }]);
  };

  progressGracefully = (percent, callback) => {
    let interval = setInterval(() => {
      percent += Math.ceil(Math.random() * Math.floor(4)) + Math.random();
      if (percent >= 100) {
        clearInterval(interval);
        this.setProgressWidth();
        return callback();
      }
      this.setProgressWidth(percent);
    }, 200);
  };

  setProgressWidth = (width = 100) => {
    const newWidth = -100 + parseFloat(width);
    this.progress.current.style.transform = `translateX(calc(${newWidth}%))`;
    this.progress.current.textContent = parseFloat(width).toFixed(2) + "%";
  };

  render() {
    const canGenerate = window.NODE_ENV === "production";
    const preview = config.baseName + "/static/" + getHostName();
    return (
      <StyledSection>
        <div>
          <StyledCard
            title="Static Site Generator"
            subtitle="Here you can generate static pages of your website"
          >
            <div>
              Preview your static site{" "}
              <a rel="noopener noreferrer" target="_blank" href={preview}>
                here
              </a>
              .
              <br />
            </div>
            {this.state.processingFiles && (
              <ProgressBar>
                <span ref={this.progress} />
              </ProgressBar>
            )}
            <strong>
              <small ref={this.message} />
            </strong>
            <br />
            {!canGenerate && (
              <Warning>
                Static Site cannot be generated in dev mode. Start letterpad
                using `yarn prod`.
              </Warning>
            )}
            {canGenerate && (
              <Button
                success
                sm
                onClick={this.createStaticFiles}
                disabled={this.state.processingFiles}
              >
                Create Static
              </Button>
            )}
          </StyledCard>
          <br />
        </div>
      </StyledSection>
    );
  }
}

CreateStatic.propTypes = {
  data: PropTypes.object,
  updateOptions: PropTypes.func,
  chunkToJSON: PropTypes.func,
  sendRequest: PropTypes.func,
  t: PropTypes.func,
  options: PropTypes.object,
};

CreateStatic.defaultPropTypes = {
  data: JSON.stringify({
    text_notfound: "",
  }),
};

export default translate("translations")(CreateStatic);

const getHostName = () => {
  return location.host.replace(":", "_");
};
