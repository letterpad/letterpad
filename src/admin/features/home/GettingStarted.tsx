import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledCard from "../../components/card";
import StyledIcon from "../../components/icon";
import StyledLink from "../../components/link";
import StyledList from "../../components/list";

const GettingStarted = ({ t }) => {
  return (
    <StyledCard title={t("home.gettingStarted")} subtitle={t("home.tagline")}>
      <StyledList>
        <li>
          <StyledIcon name="settings" />
          <StyledLink normal to="/admin/settings">
            {t("home.configure")}
          </StyledLink>
        </li>
        <li>
          <StyledIcon name="edit" />
          <StyledLink normal to="/admin/post-new">
            {t("home.write")}
          </StyledLink>
        </li>
        <li>
          <StyledIcon name="visibility" />
          <StyledLink normal to="/">
            {t("home.view")}
          </StyledLink>
        </li>
      </StyledList>
    </StyledCard>
  );
};

GettingStarted.propTypes = {
  t: PropTypes.func,
};
export default translate("translations")(GettingStarted);
