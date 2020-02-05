import React from "react";
import Posts from "./Posts";
import SinglePage from "./SinglePage";
import { IThemeContainer, EnumContentType } from "letterpad-src/client/types";

const Home: IThemeContainer = props => {
  if (props.contentType === EnumContentType.POSTS) {
    return <Posts {...props} />;
  }
  return <SinglePage {...props} />;
};
export default Home;
