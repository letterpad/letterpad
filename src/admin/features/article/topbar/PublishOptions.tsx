import { Button, ButtonGroup } from "../../../components/button";

import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import styled from "styled-components";

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
  const isDraft = status === PostStatusOptions.Draft;
  const isDeleted = status === PostStatusOptions.Trash;
  return (
    <Container>
      <label>Publish Options</label>
      <ButtonGroup className="flex-horizontal">
        <Button
          btnStyle={isPublished ? "primary" : "default"}
          onClick={() => onChange({ status: PostStatusOptions.Publish })}
          active={isPublished}
        >
          Publish
        </Button>
        <Button
          btnStyle={isDraft ? "primary" : "default"}
          onClick={() => onChange({ status: PostStatusOptions.Draft })}
          active={isDraft}
        >
          Draft
        </Button>
        <Button
          btnStyle={isDeleted ? "primary" : "danger"}
          onClick={() => onChange({ status: PostStatusOptions.Trash })}
          active={isDraft}
        >
          Delete
        </Button>
      </ButtonGroup>
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
