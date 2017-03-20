import React, { Component } from "react";

class MenuCreation extends Component {
    render() {
        return (
            <div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="page-title">
                        <h3>Menu</h3>
                    </div>
                </div>
                <textarea
                    className="form-control"
                    id="json-output"
                    rows="5"
                />
            </div>
        );
    }
}

export default MenuCreation;
