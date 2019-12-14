import styled from "styled-components";

const EditMediaInfo = styled.div`
  .media-container {
    max-width: 700px;
    margin: auto;
    .media-wrapper {
      height: 300px;
      max-width: 700px;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .media-info {
      flex: 1;
      text-align: left;
      margin-top: -60px;
      .navigation {
        margin-bottom: 60px;
        text-align: center;
      }
    }
  }
`;
export default EditMediaInfo;
