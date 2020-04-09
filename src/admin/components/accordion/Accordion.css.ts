import styled from "styled-components";

interface IPropsHead {
  active: boolean;
}
export const AccordionHead = styled.button<IPropsHead>`
  background-color: transparent;
  color: var(--color-base);
  cursor: pointer;
  padding: 25px 0px;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  transition: background-color 0.6s ease;
  border-top: 1px solid var(--color-border);
  &:hover {
    background-color: var(--bg-base);
  }
  background-color: ${p => (p.active ? "var(--bg-base)" : "")};

  h2 {
    margin-top: 0px;
    margin-bottom: 8px;
    font-size: 1.2rem;
    font-weight: normal;
    text-align: left;
  }
  p {
    font-size: 0.9rem;
    opacity: 0.6;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  /* Style the accordion chevron icon */
  .accordion__icon {
    margin-left: auto;
    transition: transform 0.6s ease;
  }

  /* Style to rotate icon when state is active */
  .rotate {
    transform: rotate(90deg);
  }

  /* Style the accordion content panel. Note: hidden by default */
  .accordion__content {
    overflow: hidden;
    transition: max-height 0.6s ease;
    .accordion__text {
      padding-bottom: 40px;
    }
  }
`;
