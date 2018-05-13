import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div
                    className="footer-open"
                    dangerouslySetInnerHTML={{ __html: this.props.data }}
                />
                <div className="footer-closed">
                    {/* Small icon for footer. TBD */}
                </div>
            </div>
        );
    }
}
