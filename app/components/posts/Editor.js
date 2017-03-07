import React, { Component } from "react";

const Editor = React.createClass({
    componentDidMount() {
        this.loadEditor();
    },
    componentWillReceiveProps(newState) {
        if (newState.body !== this.props.body) {
            tinymce.activeEditor.setContent(newState.body || '');
        }
    },

    loadEditor() {
        tinymce.init({
            selector: "textarea.editor",
            height: 300,
            menubar: false,
            theme: "modern",
            plugins: [
                "advlist autolink lists link charmap print hr anchor pagebreak",
                "wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "paste textcolor colorpicker textpattern imagetools codesample",
            ],
            toolbar1: "undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link print | forecolor backcolor | codesample",
            image_advtab: true,
            init_instance_callback: () => {
                tinymce.activeEditor.setContent(this.props.body);
            },
        });
    },

    render() {
        return <textarea className="editor" />;
    },
});

export default Editor;
