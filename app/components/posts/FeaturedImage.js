import React, { Component } from "react";

export default class FeaturedImage extends Component {
    constructor(props) {
        super(props);
        this.props.uploadInput;
    }

    openUploadWindow() {
        this.refs.uploadInput.click();
    }

    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Set Featured Image</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div id="featured-image">
                        {this.props.post.data.cover_image &&
                            <img
                                width="100%"
                                src={this.props.post.data.cover_image}
                            />}
                    </div>
                    {(() => {
                        if (!this.props.post.data.cover_image) {
                            return (
                                <a
                                    className="text-primary pointer"
                                    onClick={this.openUploadWindow.bind(this)}
                                >
                                    Set Featured Image
                                </a>
                            );
                        }else{
                            return (
                                <a
                                    className="text-primary pointer"
                                    onClick={this.props.removeFeaturedImage}
                                >
                                    Remove Featured Image
                                </a>
                            );
                        }
                    })()}
                    <input
                        ref="uploadInput"
                        onChange={input =>
                            this.props.insertFeaturedImage(input.target.files)}
                        type="file"
                        className="hide"
                        name="uploads[]"
                        multiple="multiple"
                    />
                </div>
            </div>
        );
    }
}
