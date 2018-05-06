import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div dangerouslySetInnerHTML={{ __html: this.props.data }} />
            </div>
        );
    }
}
