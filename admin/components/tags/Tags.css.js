import styled from "styled-components";

export default styled.div`
  .Select {
    position: relative;
    input {
      &::-webkit-contacts-auto-fill-button,
      &::-webkit-credentials-auto-fill-button,
      &::-ms-clear,
      &::-ms-reveal {
        display: none !important;
      }
    }
    box-sizing: border-box;
    div,
    input,
    span {
      box-sizing: border-box;
    }
    &.is-disabled {
      .Select-arrow-zone {
        cursor: default;
        pointer-events: none;
        opacity: 0.35;
      }
      > .Select-control {
        background-color: #f9f9f9;
        &:hover {
          box-shadow: none;
        }
      }
    }
    &.is-open > .Select-control {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background: #fff;
      border-color: #b3b3b3 #ccc #d9d9d9;
      .Select-arrow {
        top: -2px;
        border-color: transparent transparent #999;
        border-width: 0 5px 5px;
      }
    }
    &.is-searchable {
      &.is-focused:not(.is-open) > .Select-control,
      &.is-open > .Select-control {
        cursor: text;
      }
    }
    &.is-focused {
      > .Select-control {
        background: #fff;
      }
      &:not(.is-open) > .Select-control {
        border-color: #007eff;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
          0 0 0 3px rgba(0, 126, 255, 0.1);
        background: var(--bg-base);
      }
    }
    &.has-value {
      &.is-clearable.Select--single > .Select-control .Select-value {
        padding-right: 42px;
      }
      &.is-pseudo-focused.Select--single
        > .Select-control
        .Select-value
        .Select-value-label,
      &.Select--single > .Select-control .Select-value .Select-value-label {
        color: #333;
      }
      &.is-pseudo-focused.Select--single
        > .Select-control
        .Select-value
        a.Select-value-label,
      &.Select--single > .Select-control .Select-value a.Select-value-label {
        cursor: pointer;
        text-decoration: none;
      }
      &.is-pseudo-focused.Select--single
        > .Select-control
        .Select-value
        a.Select-value-label {
        &:focus,
        &:hover {
          color: #007eff;
          outline: none;
          text-decoration: underline;
        }
      }
      &.Select--single > .Select-control .Select-value a.Select-value-label {
        &:focus,
        &:hover {
          color: #007eff;
          outline: none;
          text-decoration: underline;
        }
      }
      &.is-pseudo-focused.Select--single
        > .Select-control
        .Select-value
        a.Select-value-label:focus,
      &.Select--single
        > .Select-control
        .Select-value
        a.Select-value-label:focus {
        background: #fff;
      }
      &.is-pseudo-focused .Select-input {
        opacity: 0;
      }
    }
    &.is-open .Select-arrow,
    .Select-arrow-zone:hover > .Select-arrow {
      border-top-color: #666;
    }
    &.Select--rtl {
      direction: rtl;
      text-align: right;
    }
  }

  .Select-control {
    border-radius: 4px;
    background: var(--bg-base);
    border: 1px solid var(--color-border);
    color: #333;
    cursor: default;
    display: table;
    border-spacing: 0;
    border-collapse: separate;
    height: 36px;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;
    &:hover {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    }
    .Select-input:focus {
      outline: none;
      background: #fff;
    }
  }

  .Select--single > .Select-control .Select-value,
  .Select-placeholder {
    bottom: 0;
    color: #aaa;
    left: 0;
    line-height: 34px;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    right: 0;
    top: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Select-input {
    height: 34px;
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: middle;
    > input {
      width: 100%;
      background: none transparent;
      border: 0 none;
      box-shadow: none;
      cursor: default;
      display: inline-block;
      font-family: inherit;
      font-size: inherit;
      margin: 0;
      outline: none;
      line-height: 17px;
      padding: 8px 0 12px;
      -webkit-appearance: none;
    }
  }

  .is-focused .Select-input > input {
    cursor: text;
  }

  .has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }

  .Select-control:not(.is-searchable) > .Select-input {
    outline: none;
  }

  .Select-loading-zone {
    cursor: pointer;
    display: table-cell;
    text-align: center;
  }

  .Select-loading,
  .Select-loading-zone {
    position: relative;
    vertical-align: middle;
    width: 16px;
  }

  .Select-loading {
    -webkit-animation: Select-animation-spin 0.4s infinite linear;
    -o-animation: Select-animation-spin 0.4s infinite linear;
    animation: Select-animation-spin 0.4s infinite linear;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-right-color: #333;
    display: inline-block;
  }

  .Select-clear-zone {
    -webkit-animation: Select-animation-fadeIn 0.2s;
    -o-animation: Select-animation-fadeIn 0.2s;
    animation: Select-animation-fadeIn 0.2s;
    color: #999;
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 17px;
    &:hover {
      color: #d0021b;
    }
  }

  .Select-clear {
    display: inline-block;
    font-size: 18px;
    line-height: 1;
  }

  .Select--multi .Select-clear-zone {
    width: 17px;
  }

  .Select-arrow-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 25px;
    padding-right: 5px;
  }

  .Select--rtl .Select-arrow-zone {
    padding-right: 0;
    padding-left: 5px;
  }

  .Select-arrow {
    border-color: #999 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 2.5px;
    display: inline-block;
    height: 0;
    width: 0;
    position: relative;
  }

  .Select-control > :last-child {
    padding-right: 5px;
  }

  .Select--multi .Select-multi-value-wrapper {
    display: inline-block;
  }

  .Select .Select-aria-only {
    position: absolute;
    display: inline-block;
    height: 1px;
    width: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    float: left;
  }

  @-webkit-keyframes Select-animation-fadeIn {
    0% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes Select-animation-fadeIn {
    0% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .Select-menu-outer {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top-color: #e6e6e6;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: -1px;
    max-height: 200px;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
  }

  .Select-menu {
    max-height: 198px;
    overflow-y: auto;
  }

  .Select-option {
    box-sizing: border-box;
    background-color: #fff;
    color: #666;
    cursor: pointer;
    display: block;
    padding: 8px 10px;
    &:last-child {
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &.is-selected {
      background-color: #f5faff;
      background-color: rgba(0, 126, 255, 0.04);
      color: #333;
    }
    &.is-focused {
      background-color: #ebf5ff;
      background-color: rgba(0, 126, 255, 0.08);
      color: #333;
    }
    &.is-disabled {
      color: #ccc;
      cursor: default;
    }
  }

  .Select-noresults {
    box-sizing: border-box;
    color: #999;
    cursor: default;
    display: block;
    padding: 8px 10px;
  }

  .Select--multi {
    .Select-input {
      vertical-align: middle;
      margin-left: 10px;
      padding: 0;
    }
    &.Select--rtl .Select-input {
      margin-left: 0;
      margin-right: 10px;
    }
    &.has-value .Select-input {
      margin-left: 5px;
    }
    .Select-value {
      background-color: #ebf5ff;
      background-color: rgba(0, 126, 255, 0.08);
      border-radius: 2px;
      border: 1px solid #c2e0ff;
      border: 1px solid rgba(0, 126, 255, 0.24);
      color: #007eff;
      display: inline-block;
      font-size: 0.9em;
      line-height: 1.4;
      margin-left: 5px;
      margin-top: 5px;
      vertical-align: top;
    }
    .Select-value-icon {
      display: inline-block;
      vertical-align: middle;
    }
    .Select-value-label {
      display: inline-block;
      vertical-align: middle;
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      cursor: default;
      padding: 2px 5px;
    }
    a.Select-value-label {
      color: #007eff;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .Select-value-icon {
      cursor: pointer;
      border-bottom-left-radius: 2px;
      border-top-left-radius: 2px;
      border-right: 1px solid #c2e0ff;
      border-right: 1px solid rgba(0, 126, 255, 0.24);
      padding: 1px 5px 3px;
      &:focus,
      &:hover {
        background-color: #d8eafd;
        background-color: rgba(0, 113, 230, 0.08);
        color: #0071e6;
      }
      &:active {
        background-color: #c2e0ff;
        background-color: rgba(0, 126, 255, 0.24);
      }
    }
    &.Select--rtl {
      .Select-value {
        margin-left: 0;
        margin-right: 5px;
      }
      .Select-value-icon {
        border-right: none;
        border-left: 1px solid #c2e0ff;
        border-left: 1px solid rgba(0, 126, 255, 0.24);
      }
    }
    &.is-disabled {
      .Select-value {
        background-color: #fcfcfc;
        border: 1px solid #e3e3e3;
        color: #333;
      }
      .Select-value-icon {
        cursor: not-allowed;
        border-right: 1px solid #e3e3e3;
        &:active,
        &:focus,
        &:hover {
          background-color: #fcfcfc;
        }
      }
    }
  }

  @keyframes Select-animation-spin {
    to {
      transform: rotate(1turn);
    }
  }

  @-webkit-keyframes Select-animation-spin {
    to {
      -webkit-transform: rotate(1turn);
    }
  }
`;
