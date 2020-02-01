import React from "react";
import { IThemeContainer } from "../types";

const Home: IThemeContainer = _props => {
  return (
    <div>
      This is just a abstract component. You should create a theme and keep this
      File inside containers directory...
      {_props.initialProps && JSON.stringify(_props.initialProps)}
    </div>
  );
};
Home.getInitialProps = async ({ match, client }) => {
  console.log("Received home static method");

  return "hello world";
};
export default Home;
