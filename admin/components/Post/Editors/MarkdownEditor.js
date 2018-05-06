import React, { Component } from "react";
import { CodeFlask } from "../../../libraries/code-flask";
import PostActions from "../PostActions";
const marked = require("marked");

const qs = selector => document.querySelector;

class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        // this.setActiveTab = this.setActiveTab.bind(this);
        this.getPreview = this.getPreview.bind(this);
        this.state = {
            body: this.props.mdBody
        };
    }
    componentDidMount() {
        var flask = new CodeFlask();
        flask.run("#md-post", {
            language: "markdown",
            placeholder: "..."
        });
        flask.onUpdate(text => {
            PostActions.setData({
                mdBody: text,
                mdPreview: this.getPreview(text)
            });
        });

        PostActions.setData({
            mdPreview: this.getPreview(this.state.body || "")
        });
    }

    getPreview(text) {
        return marked(text).replace(/<pre>/g, '<pre class="hljs">');
    }

    // setActiveTab(e) {
    //     e.preventDefault();
    //     const active = e.target.getAttribute("href");
    //     this.state.activeTab.post = "";
    //     this.state.activeTab.preview = "";
    //     this.state.activeTab[active] = "active";
    //     this.setState(this.state);

    //     if (active == "preview") {
    //         marked.setOptions({
    //             highlight: code => hljs.highlightAuto(code).value
    //         });

    //         const preview = this.getPreview(this.state.body);
    //         // qs("#md-preview").innerHTML = preview;
    //         PostActions.setData({
    //             mdPreview: preview
    //         });
    //     }
    // }
    render() {
        return <div id="md-post">{this.state.body}</div>;
    }
}

export default MarkdownEditor;
