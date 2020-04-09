import "isomorphic-fetch";

import {
  AdminBaseStyle,
  AdminGlobalStyle,
  NormalizeCss,
} from "./adminGlobal.css";
import React, { useEffect, useState } from "react";

import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import client from "../shared/apolloClient";
import config from "../config";
import { render } from "react-dom";
import styled from "styled-components";
import { switchTheme } from "./utility";

const isAdmin = true;

const ThemeContainer = styled.div`
  position: fixed;
  left: 98%;
  z-index: 9999;
  button {
    color: orange;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(localStorage.theme || "theme-light");

  useEffect(() => {
    switchTheme(setTheme);
  }, []);

  return (
    <ThemeContainer>
      <button onClick={() => switchTheme(setTheme)}>
        {theme === "theme-dark" ? "☀" : "🌑"}
      </button>
    </ThemeContainer>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={config.BASE_NAME}>
      <ApolloProvider client={client(isAdmin)}>
        <NormalizeCss />
        <AdminGlobalStyle />
        <AdminBaseStyle />
        <ThemeSwitch />
        <Routes />
      </ApolloProvider>
    </BrowserRouter>
  );
};

render(<App />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
