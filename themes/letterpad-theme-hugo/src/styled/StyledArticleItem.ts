import styled from "styled-components";

export default styled.article`
  position: relative;
  line-height: 1.8;
  display: flex;
  max-width: 70rem;
  margin: auto;
  margin-bottom: 40px;
  border-top: none;

  @media screen and (max-width: 1250px) {
    flex-direction: column-reverse;
  }
  @media screen and (max-width: 800px) {
    margin: 0 -20px 40px -20px;
  }
  .post-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid rgba(var(--bg-article-item));
    box-shadow: -1px -1px 22px 1px rgba(var(--bg-article-item));
    padding: 0 20px;
    footer {
      display: flex;
      align-items: flex-end;
    }
    @media screen and (max-width: 800px) {
      border: none;
    }

    a {
      color: rgba(var(--color-accent));
      &.post-link {
        color: var(--color-base);
        &:hover {
          color: rgba(var(--color-accent));
        }
      }
    }
  }
  .post-image-box {
    flex: 0 0 30rem;
    overflow: hidden;
    a {
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
      img {
        width: 100%;
        height: 300px;
        transition: 0.3s transform linear;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    @media screen and (max-width: 1250px) {
      overflow: visible;
      flex: 0;
      a img {
        object-fit: cover;
        object-position: bottom;
        &:hover {
          transform: scale(1);
        }
      }
    }
  }
  a {
    &:focus,
    &:hover {
      color: rgba(var(--color-accent));
    }
  }
  + .post-entry {
    border-color: var(--color-border);
  }
  .post-title {
    margin-top: 24px;
  }
  .post-cover {
    position: absolute;
    top: 4.6rem;
    right: 0;
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    font-family: "object-fit: cover;";
    border-radius: 3px;
    + .post-summary {
      padding-right: 9rem;
    }
    @media screen and (max-width: 800px) {
      position: static;
      width: 100vw;
      height: 56.25vw;
      border-radius: 0;
      margin: 0 -1rem;
      + .post-summary {
        padding-right: 0;
      }
    }
  }
  .post-summary {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-align: left;
    word-break: break-all;
    opacity: 0.7;
    hyphens: auto;
  }
  .post-footer {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
`;
