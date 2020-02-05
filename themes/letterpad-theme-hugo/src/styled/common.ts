import styled from "styled-components";
import { Link } from "react-router-dom";

export const PostTitle = styled.h2<any>`
  font-size: ${p => (p.large ? 2 : 1.5)}rem;
  line-height: ${p => (p.large ? 2 : 1.5)};
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.3rem;
`;
export const PostMeta = styled.h2`
  font-size: 0.8rem;
  letter-spacing: 1px;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

export const SiteLogo = styled.div`
  img {
    margin-top: 2rem;
    max-width: 10rem;
    margin-bottom: 2rem;
    max-height: 80px;
  }

  @media screen and (max-width: 800px) {
    img {
      position: relative;
      top: 8px;
      margin-top: 0;
      max-height: 60px;
      margin-bottom: 60px;
    }
  }
`;

export const StyledTags = styled.div`
  display: inline;
  a {
    color: rgba(var(--color-accent));
    font-size: 14px;
    margin-right: 8px;
  }
`;

export const StyledReadMore = styled(Link)`
  font-size: 0.8rem;
  letter-spacing: 1px;
`;
