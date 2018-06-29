import React, { Component } from "react";
import FileExplorerModal from "../../../Modals/FileExplorerModal";
import PropTypes from "prop-types";

class ToolBar extends Component {
    static propTypes = {
        insertImage: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        value: PropTypes.object.isRequried,
        onChange: PropTypes.func.isRequired
    };
    imageInputRef = React.createRef();

    state = {
        fileExplorerOpen: false
    };

    insertMedia = image => {
        const change = this.props.value
            .change()
            .call(this.props.insertImage, image);
        this.props.onChange(change);
        this.toggleFileExplorer();
    };

    toggleFileExplorer = () => {
        this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
    };

    render() {
        return (
            <React.Fragment>
                <div className="menu toolbar-menu">
                    <span
                        className="button"
                        onMouseDown={this.toggleFileExplorer}
                    >
                        <span className="material-icons">image</span>
                    </span>
                </div>
                <input
                    ref={this.imageInputRef}
                    className="hide post-image"
                    type="file"
                    multiple
                    onChange={input =>
                        this.props.uploadImage(input.target.files)
                    }
                />
                {this.state.fileExplorerOpen && (
                    <FileExplorerModal
                        onClose={this.toggleFileExplorer}
                        onMediaSelect={this.insertMedia}
                        addNewMedia={() => {
                            this.imageInputRef.current.click();
                            this.toggleFileExplorer();
                        }}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default ToolBar;
