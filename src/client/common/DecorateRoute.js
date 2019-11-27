import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "../../config";

const DecorateRoute = (WrappedComponent, { settings, type }) => {
  class ChildComponent extends Component {
    unlistenHistory = () => {};

    componentDidMount() {
      this.unlistenHistory = this.props.history.listen(this.analyticsAction);
    }

    componentWillUnmount() {
      this.unlistenHistory();
    }

    analyticsAction = () => {
      if (settings.google_analytics.value) {
        ga("set", "page", config.baseName + location.pathname);
        ga("send", "pageview");
      }
    };

    render() {
      return (
        <WrappedComponent
          router={{ ...this.props }}
          settings={settings}
          type={type}
        />
      );
    }
  }
  ChildComponent.displayName = WrappedComponent.displayName;

  ChildComponent.propTypes = {
    history: PropTypes.object,
  };
  return ChildComponent;
};
export default DecorateRoute;
