import React from "react";

const Home: React.FC = props => {
  console.log("home component props :", props);
  return (
    <div>
      This is just a abstract component. You should create a theme and keep this
      File inside containers directory
    </div>
  );
};

export default Home;
