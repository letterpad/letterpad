import React from "react";

const Home: React.FC<any> & {
  getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
} = _props => {
  return (
    <div>
      This is just a abstract component. You should create a theme and keep this
      File inside containers directory...{_props.data && _props.data}
    </div>
  );
};
Home.getInitialProps = async ({ match, req, res, client }) => {
  console.log("Received home static method");

  return "hello world";
};
export default Home;
