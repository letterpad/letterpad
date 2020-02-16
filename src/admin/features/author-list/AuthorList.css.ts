import styled from "styled-components";

const StyledAuthorList = styled.div`
  @media (max-width: 767px) {
    .author-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 450px) {
    .author-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default StyledAuthorList;
