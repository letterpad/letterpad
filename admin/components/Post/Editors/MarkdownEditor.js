import React, { Component } from "react";
import { CodeFlask } from "../../../libraries/code-flask";
import PostActions from "../PostActions";
const marked = require("marked");

class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        this.setActiveTab = this.setActiveTab.bind(this);
        this.state = {
            body: this.props.mdBody,
            activeTab: {
                post: "active",
                preview: ""
            }
        };
    }
    componentDidMount() {
        var flask = new CodeFlask();
        flask.run("#md-post", {
            language: "markdown"
        });
        flask.onUpdate(text => {
            PostActions.setData({
                mdBody: text,
                mdPreview: marked(text).replace(/<pre>/g, '<pre class="hljs">')
            });
        });
    }

    setActiveTab(e) {
        e.preventDefault();
        const active = e.target.getAttribute("href");
        this.state.activeTab.post = "";
        this.state.activeTab.preview = "";
        this.state.activeTab[active] = "active";
        this.setState(this.state);

        if (active == "preview") {
            marked.setOptions({
                highlight: code => hljs.highlightAuto(code).value
            });
            document.querySelector("#md-preview").innerHTML = marked(
                document.querySelector("#md-post").innerText
            ).replace(/<pre>/g, '<pre class="hljs">');
        }
    }
    render() {
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li className={this.state.activeTab.post}>
                        <a
                            href="post"
                            data-toggle="tab"
                            onClick={this.setActiveTab}
                        >
                            Post
                        </a>
                    </li>
                    <li className={this.state.activeTab.preview}>
                        <a
                            href="preview"
                            data-toggle="tab"
                            onClick={this.setActiveTab}
                        >
                            Preview
                        </a>
                    </li>
                </ul>

                <div className="tab-content clearfix">
                    <div className={"tab-pane " + this.state.activeTab.post}>
                        <div id="md-post">{this.state.body}</div>
                    </div>
                    <div
                        id="md-preview"
                        className={"tab-pane " + this.state.activeTab.preview}
                    >
                        Preview
                    </div>
                </div>
            </div>
        );
    }
}

export default MarkdownEditor;
