import React, { Component } from "react";
import { CodeFlask } from "../../../libraries/code-flask";
import PostActions from "../PostActions";
const marked = require("marked");

const qs = selector => document.querySelector;

class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        this.getPreview = this.getPreview.bind(this);
        this.state = {
            body: this.props.mdBody
        };
    }
    componentDidMount() {
        var flask = new CodeFlask();
        flask.run("#md-post", {
            language: "markdown",
            placeholder: "...",
            lineNumbers: true
        });
        flask.onUpdate(text => {
            PostActions.setData({
                mdBody: text,
                mdPreview: this.getPreview(text)
            });
        });

        PostActions.setData({
            mdPreview: this.getPreview(this.props.mdBody || "")
        });
    }

    getPreview(text) {
        return marked(text).replace(/<pre>/g, '<pre class="hljs">');
    }

    componentDidUpdate(prevProps, prevState) {
        document.querySelectorAll(".hljs code").forEach(hljs.highlightBlock);
    }

    render() {
        return <div id="md-post">{this.state.body}</div>;
    }
}

export default MarkdownEditor;
