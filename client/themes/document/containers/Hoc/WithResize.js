import React, { Component } from "react";

const WithResize = WrappedComonent => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.onResize = this.onResize.bind(this);
            this.setResizeTracker = this.setResizeTracker.bind(this);
            this.tracker = null;
            this.mounted = false;
            this.timer = null;
            this.state = {
                clientWidth: 0
            };
        }
        componentDidMount() {
            this.mounted = true;
            if (typeof window !== "undefined") {
                window.addEventListener("resize", this.onResize);
            }
            this.onResize();
        }
        componentWillUnmount() {
            this.mounted = false;
            window.removeEventListener("resize", this.onResize);
        }
        setResizeTracker(tracker) {
            this.tracker = tracker;
        }
        onResize() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.mounted) {
                    const tracker = document.querySelector(this.tracker);
                    const { clientWidth } = tracker || document.body;
                    this.setState({ clientWidth });
                }
            }, 50);
        }

        render() {
            return (
                <WrappedComonent
                    setResizeTracker={this.setResizeTracker}
                    {...this.props}
                    {...this.state}
                />
            );
        }
    };
};

export default WithResize;
