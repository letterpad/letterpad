import React, { Component } from "react";
import moment from "moment";

export default class About extends Component {
    render() {
        return (
            <aside id="ajaxtown_about_widget" className="widget">
                <h3 className="widget-title">Redsnow</h3>
                <div className="about-widget">
                    <p>
                        {this.props.about}
                    </p>
                </div>
            </aside>
        );
    }
}
