import React, { Component } from "react";
import Dropzone from "react-dropzone";

export default class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: []
        };
    }
    onDrop(files) {
        this.setState({
            files: files
        });
        this.props.onFileUpload(files)
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    render() {
        return (
            <div>
                <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} />
                <button type="button" onClick={this.onOpenClick.bind(this)}>
                    Open Dropzone
                </button>
            </div>
        );
    }
}