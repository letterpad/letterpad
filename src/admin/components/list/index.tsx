import React from "react";
// import PropTypes from "prop-types";
import styled from "styled-components";

const StyledList = styled.ul`
  line-height: 30px;
  list-style-type: none;
  padding: 0px;
  li {
    display: flex;
    align-items: center;
  }
`;

const List = ({ children, ...props }) => {
  return <StyledList {...props}>{children}</StyledList>;
};

// List.propTypes = {
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]),
// };

export default List;
