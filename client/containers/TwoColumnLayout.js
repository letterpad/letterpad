import React from "react";


export default function TwoColumnLayout(Component) {
    return class extends React.Component {

        constructor(props) {
            super(props)
        }

        render() {
            return (
                <div>
                    <div className="right_col" role="main" style={{'minHeight': 'calc(100vh - 50px)'}}>
                        <Component {...this.props} />
                    </div>
                </div>
            );
        }
    };
}