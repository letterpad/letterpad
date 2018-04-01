import React, { Component } from "react";
import ReactDOM from "react-dom";

const LazyLoad = WrappedComponent => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.onIntersection = this.onIntersection.bind(this);
            this.loadImage = this.loadImage.bind(this);
            this.fetchImage = this.fetchImage.bind(this);
            const config = {
                // If the image gets within 50px in the Y axis, start the download.
                rootMargin: "50px 0px",
                threshold: 0.01
            };

            this.isBrowser = typeof window !== "undefined";
            // The observer for the images on the page
            if (this.isBrowser) {
                this.observer = new IntersectionObserver(
                    this.onIntersection,
                    config
                );
            }
        }
        componentDidMount() {
            if (this.isBrowser) {
                const images = ReactDOM.findDOMNode(this).querySelectorAll(
                    ".lazy-image"
                );
                images.forEach(image => {
                    this.observer.observe(image);
                });
            }
        }

        fetchImage(url) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.src = url;
                image.onload = resolve;
                image.onerror = reject;
            });
        }

        loadImage(image) {
            const src = image.dataset.src;
            this.fetchImage(src).then(() => {
                image.src = src;
            });
        }

        onIntersection(entries) {
            // Loop through the entries
            entries.forEach(entry => {
                // Are we in viewport?
                if (entry.intersectionRatio > 0) {
                    // Stop watching and load the image
                    this.observer.unobserve(entry.target);
                    this.loadImage(entry.target);
                }
            });
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};
export default LazyLoad;
