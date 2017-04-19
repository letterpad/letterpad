import React, { Component } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { gql, graphql } from "react-apollo";
require("../../public/scss/common.scss");
require("../../public/scss/client.scss");

class App extends Component {
    render() {
        if (this.props.loading) {
            return <div>hello</div>;
        }
        return (
            <div>
                <Menu menu={JSON.parse(this.props.settings.menu.value)} />
                {React.cloneElement(this.props.children, this.props)}
            </div>
        );
    }
}

const optionsQuery = gql`
  query getOptions {
  settings {
    id,
    option,
    value
  }
}
`;

const ContainerWithSiteData = graphql(optionsQuery, {
    props: ({ data: { loading, settings } }) => {
        let data = {};
        settings &&
            settings.map(setting => {
                data[setting.option] = setting;
            });
        return {
            settings: data,
            loading: loading
        };
    }
});

export default ContainerWithSiteData(App);
