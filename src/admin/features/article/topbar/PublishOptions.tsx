import { Button, ButtonGroup } from "../../../components/button";

import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import styled from "styled-components";
import StyledSwitch from "../../../components/switch";

interface IProps {
  status: PostStatusOptions;
  updatePost: () => void;
}

const PublishOptions: React.FC<IProps> = ({ status, updatePost }) => {
  const onChange = ({ status }: { status: PostStatusOptions }) => {
    PostActions.setDraft({ status });
    updatePost();
  };
  const isPublished = status === PostStatusOptions.Publish;
  return (
    <Container>
      <StyledSwitch
        leftLabel="Published"
        isSelected={isPublished}
        onChange={selected =>
          onChange({
            status: selected
              ? PostStatusOptions.Publish
              : PostStatusOptions.Draft,
          })
        }
      />
    </Container>
  );
};

export default PublishOptions;

const Container = styled.div`
  .flex-horizontal {
    display: flex;
    > * {
      flex: 1;
    }
  }
`;
