import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Button from "../../components/button";
import Input from "../../components/input";

addEventListener("fetch", event => {
  event.respondWith(fetchAndStream(event.request));
});

async function fetchAndStream(request) {
  // Fetch from origin server.
  let response = await fetch(request);

  // Create an identity TransformStream (a.k.a. a pipe).
  // The readable side will become our new response body.
  // eslint-disable-next-line no-undef
  let { readable, writable } = new TransformStream();

  // Start pumping the body. NOTE: No await!
  streamBody(response.body, writable);

  // ... and deliver our Response while that's running.
  return new Response(readable, response);
}

async function streamBody(readable, writable) {
  // This function will continue executing after `fetchAndStream()`
  // returns its response.
  return readable.pipeTo(writable);
}

class Github extends Component {
  state = {
    processing: false,
  };

  updateOption = (option, value) => {
    this.props.updateOption(option, value);
  };

  createStaticFiles = async () => {
    this.setState({ processing: true });
    await fetch("http://localhost:4040/admin/generate-static-site")
      .then(res => res.text())
      .then(res => {
        console.log(res);
        this.setState({ processing: false });
      });
  };

  createPullRequest = async () => {
    await fetch("http://localhost:4040/admin/create-pull-request")
      .then(res => res.text())
      .then(res => {
        console.log(res);
      });
  };

  render() {
    // const { t } = this.props;

    return (
      <div>
        {this.state.processing && <span>Generating static assets...</span>}
        <Input
          label="Github Token"
          defaultValue={this.props.data.github_token.value}
          type="text"
          onBlur={e => this.updateOption("github_token", e.target.value)}
        />
        <Button success onClick={this.createStaticFiles}>
          Create Static
        </Button>
        <Button success onClick={this.createPullRequest}>
          Create PR
        </Button>
      </div>
    );
  }
}

Github.propTypes = {
  data: PropTypes.object,
  updateOption: PropTypes.func,
  t: PropTypes.func,
};

Github.defaultPropTypes = {
  data: JSON.stringify({
    text_notfound: "",
  }),
};

export default translate("translations")(Github);
