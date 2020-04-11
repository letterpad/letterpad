import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { switchTheme } from "../../utility";

if (["dark", "light"].includes(localStorage.theme)) {
  delete localStorage.theme;
}
const ThemeContainer = styled.div`
  padding: 4px 40px;
  font-size: 0.9rem;
  a {
    color: var(--color-base);
    cursor: pointer;
  }
`;

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(localStorage.theme || "theme-light");

  useEffect(() => {
    switchTheme(setTheme, theme);
  }, []);

  return (
    <ThemeContainer>
      <a
        onClick={e => {
          e.preventDefault();
          switchTheme(setTheme);
        }}
      >
        Switch to {theme === "theme-dark" ? "Light Mode" : "Dark Mode"}
      </a>
    </ThemeContainer>
  );
};

export default ThemeSwitch;
