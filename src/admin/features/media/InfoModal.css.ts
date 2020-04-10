import { device } from "./../devices";
import styled from "styled-components";

const EditMediaInfo = styled.div`
  .media-container {
    height: 100%;
    max-width: 1300px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    @media ${device.laptop} {
      flex-direction: column;
      max-width: calc(72vw);
    }

    margin: auto;
    .media-wrapper {
      height: calc(80vh);
      margin-right: 80px;
      position: relative;
      width: 100%;
      @media ${device.laptop} {
        margin-right: 0px;
        height: 100%;
        min-height: 200px;
        max-height: 300px;
      }
      @media ${device.tablet} {
        margin-right: 0px;
        height: 100%;
        min-height: 200px;
        max-height: 500px;
      }
      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }

    .media-info {
      margin-top: 40px;
      width: 330px;
      text-align: left;
      @media ${device.laptop} {
        width: 100%;
      }
    }
    .navigation {
      position: absolute;
      top: 50%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      button {
        background: transparent;
        border: none;
        i {
          font-size: 1.6rem;
          color: color: var(--color-base);
        }
      }
      button:first-child {
        margin-left: -50px;
      }
      button:last-child {
        margin-right: -50px;
      }
    }
  }
`;
export default EditMediaInfo;
