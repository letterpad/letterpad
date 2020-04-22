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
  ol {
    list-style-type: decimal;
  }
  .prism-dark {
    background: #252424;
    color: #fff;
    padding: 4px 8px;
    font-size: 0.95rem;
  }

  .post-header {
    margin: auto;
    padding: 0px 1rem;
    width: 100%;
    border-bottom: solid 1px var(--color-border);
    @media (min-width: 740px) {
      width: 740px;
    }
  }
  table {
    color: var(--color-base);
  }
  #letterpad-editor-container {
    background: transparent;
    width: 740px;
    margin: auto;
    padding: 0px 1rem;
    @media (max-width: 767px) {
      width: 100%;
    }
    .lp-h1 {
      border-bottom: none;
    }
    font-size: large;
  }
  .lp-datepicker {
    position: fixed;
    z-index: 999;
    top: 91px;
    left: 100%;
    margin-left: -330px;
    .react-datepicker {
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    footer {
      background: white;
      margin-top: -4px;
      padding: 4px;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
      text-align: center;
    }
  }
`;

export default StyledArticle;
