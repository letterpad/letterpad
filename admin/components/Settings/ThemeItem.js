import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ThemeItem extends Component {
    static propTypes = {
        theme: PropTypes.object.isRequired,
        activateTheme: PropTypes.func.isRequired
    };
    
    render() {
        const theme = this.props.theme;

        return (
            <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <article
                    className={"theme-item" + (theme.active ? " active" : "")}
                    onClick={e => this.props.activateTheme(e, this.props.theme)}
                >
                    <div className="theme-thumbnail">
                        <img
                            className="theme-image"
                            src={theme.details.thumbnail}
                        />
                    </div>
                    <div className="theme-body with-border">
                        <div className="theme-header">
                            <div className="theme-name">
                                {theme.details.name} by {theme.details.author}
                            </div>
                            <div className="theme-meta">
                                {theme.details.description}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}
