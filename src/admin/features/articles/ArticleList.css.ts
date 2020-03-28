import styled from "styled-components";

export const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledItem = styled.div`
  .selection-box {
    position: relative;
    z-index: 0;
    left: 100%;
    margin-left: -24px;
    border-top-right-radius: 7px;
    top: 10px;
  }
  [type="checkbox"]:checked,
  [type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="checkbox"]:checked + label,
  [type="checkbox"]:not(:checked) + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
  }
  [type="checkbox"]:checked + label:before,
  [type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0px;
    width: 18px;
    height: 18px;
    border: 1px solid #fff;
    background: #fff;
    box-shadow: 0px 0px 4px 1px #0000005c;
    border-radius: 50%;
  }
  [type="checkbox"]:checked + label:after,
  [type="checkbox"]:not(:checked) + label:after {
    content: "";
    width: 10px;
    height: 10px;
    background: #00a69c;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    transition: all 0.1s ease;
  }
  [type="checkbox"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type="checkbox"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

export const Table = styled.table<any>`
  /* Remove spacing between table cells (from Normalize.css) */
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  border: 1px solid var(--color-border);
  font-size: 14px;
  width: 100%;
  background: var(--bg-sections);
  color: var(--color-text-3);
  box-shadow: var(--box-shadow);
  .small {
    font-size: 12px;
  }
  .upper {
    text-transform: uppercase;
    padding: 2px 4px;
    background: var(--color-base-2);
  }
  .title {
    font-weight: 400;
    padding: 6px 0px;
    color: var(--color-text-2);
  }
  .status {
    font-size: 11px;

    &.publish {
      color: var(--bg-hover-success);
    }
  }

  caption {
    color: #000;
    font: italic 85%/1 arial, sans-serif;
    padding: 1em 0;
    text-align: center;
  }

  td,
  th {
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible; /*to make ths where the title is really long work*/
    padding: 12px 0 12px 0px;
  }

  tbody tr:hover {
    cursor: pointer;
    background: var(--bg-base);
  }

  thead {
    background-color: var(--bg-base);
    color: var(--color-base);
    text-align: left;
    vertical-align: bottom;
    border-bottom: 2px solid var(--color-border);
    th {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 12px 0 12px 0px;
    }
  }

  /* BORDERED TABLES */
  td {
    border-bottom: 2px solid var(--color-border);
    text-align: left;
  }
  tbody > tr:last-child > td {
    border-bottom-width: 0;
  }
`;

export const Loader = styled.div<any>`
  width: 100%;
  height: 4px;
  background: var(--color-accent);
  transition: 0.2s linear all;

  opacity: ${p => (p.loading ? 0.7 : 0)};
`;
