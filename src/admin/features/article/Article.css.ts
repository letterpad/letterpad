import styled from "styled-components";

interface IArticleProps {
  fullHeight: boolean;
}

export const Container = styled.div<IArticleProps>`
  display: flex;
  flex-direction: column;
  min-height: ${p => (p.fullHeight ? "100vh" : "auto")};

  .article-holder {
    width: 100%;
    margin: 80px auto 0;
    padding: 0 10px;

    .post-content {
      flex: 1;
    }
  }
`;

const StyledArticle = styled.article`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  ul,
  ol {
    padding-left: 20px;
    margin: initial;
    list-style-type: initial;
  }
  .prism-dark {
    background: #252424;
    color: #fff;
    padding: 4px 8px;
    font-size: 14px;
  }

  .post-header {
    max-width: 740px;
    margin: auto;
    padding: 0px 1rem;
    border-bottom: solid 1px var(--color-border);
    @media (min-width: 740px) {
      width: 740px;
    }
  }

  #letterpad-editor-container {
    background: transparent;
    width: 740px;
    margin: auto;
    padding: 0px 1rem;
    .lp-h1 {
      border-bottom: none;
    }
    font-size: large;
  }
`;

export default StyledArticle;
