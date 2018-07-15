import React from "react";
import getWindow from "get-window";
import isBackward from "selection-is-backward";
import FileExplorerModal from "../../../../Modals/FileExplorerModal";
import { insertInlineImage } from "./ImageUtils";
import { uploadFile } from "../../../../../util";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

class ImageButton extends React.Component {
    imageInputRef = React.createRef();

    state = {
        fileExplorerOpen: false
    };

    insertMedia = src => {
        this.props.onChange(
            insertInlineImage({ change: this.props.value.change(), src })
        );
        function scrollToSelection(selection) {
            if (!selection.anchorNode) return;

            const window = getWindow(selection.anchorNode);
            const backward = isBackward(selection);
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const {
                innerWidth,
                innerHeight,
                pageYOffset,
                pageXOffset
            } = window;
            const top = (backward ? rect.top : rect.bottom) + pageYOffset;
            const left = (backward ? rect.left : rect.right) + pageXOffset;

            const x =
                left < pageXOffset || innerWidth + pageXOffset < left
                    ? left - innerWidth / 2
                    : pageXOffset;

            const y =
                top < pageYOffset || innerHeight + pageYOffset < top
                    ? top - innerHeight / 2
                    : pageYOffset;

            window.scrollTo(x, y);
        }
        this.toggleFileExplorer();
    };

    toggleFileExplorer = () => {
        this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
    };

    uploadImage = async files => {
        const uploadedFiles = await uploadFile({ files, type: "post_image" });
        uploadedFiles.forEach(src => {
            this.props.onChange(
                insertInlineImage({ change: this.props.value.change(), src })
            );
        });
    };
    render() {
        const { value, onChange, changeState, style, type } = this.props;
        return (
            <React.Fragment>
                <span
                    style={style}
                    className="button"
                    type={type}
                    onMouseDown={this.toggleFileExplorer}
                >
                    <span className="material-icons">image</span>
                </span>
                <input
                    ref={this.imageInputRef}
                    className="hide post-image"
                    type="file"
                    multiple
                    onChange={input => this.uploadImage(input.target.files)}
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
export default ImageButton;
