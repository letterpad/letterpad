import { Button, ButtonGroup } from "../../../components/button";

import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import styled from "styled-components";

interface IProps {
  isFeatured: boolean;
  updatePost: () => void;
}

const FeaturedPost: React.FC<IProps> = ({ isFeatured, updatePost }) => {
  const onChange = ({ featured }: { featured: boolean }) => {
    PostActions.setDraft({ featured });
    updatePost();
  };

  return (
    <Container>
      <label>Featured Post</label>
      <ButtonGroup className="flex-horizontal">
        <Button
          btnStyle={isFeatured ? "primary" : "default"}
          onClick={() => onChange({ featured: true })}
          active={isFeatured}
        >
          Yes
        </Button>
        <Button
          btnStyle={!isFeatured ? "primary" : "default"}
          onClick={() => onChange({ featured: false })}
          active={!isFeatured}
        >
          No
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default FeaturedPost;

const Container = styled.div`
  .flex-horizontal {
    display: flex;
    > * {
      flex: 1;
    }
  }
`;
