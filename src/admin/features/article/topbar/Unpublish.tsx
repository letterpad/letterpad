import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import StyledSwitch from "../../../components/switch";
import styled from "styled-components";

interface IProps {
  status: PostStatusOptions;
  updatePost: () => void;
}

const Unpublish: React.FC<IProps> = ({ status, updatePost }) => {
  const onChange = ({ status }: { status: PostStatusOptions }) => {
    PostActions.setDraft({ status });
    updatePost();
  };
  const isPublished = status === PostStatusOptions.Publish;

  return (
    <Container>
      <StyledSwitch
        leftLabel="Unpublish this post"
        isSelected={isPublished}
        onChange={() => {
          if (isPublished) {
            onChange({
              status: PostStatusOptions.Draft,
            });
          }
        }}
      />
    </Container>
  );
};

export default Unpublish;

const Container = styled.div`
  .flex-horizontal {
    display: flex;
    > * {
      flex: 1;
    }
  }
`;
