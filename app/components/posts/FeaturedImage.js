import React, { Component } from "react";

export default class FeaturedImage extends Component {
    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Set Featured Image</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div id="featured-image" />
                    <a className="text-primary pointer" data-toggle="lean-modal" data-target="#modal-featured-image">
                        Set Featured Image
                    </a>
                </div>
            </div>
        );
    }
}