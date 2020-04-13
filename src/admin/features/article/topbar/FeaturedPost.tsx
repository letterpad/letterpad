import { Button, ButtonGroup } from "../../../components/button";

import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import styled from "styled-components";
import StyledSwitch from "../../../components/switch";

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
      <StyledSwitch
        leftLabel="Featured Post"
        isSelected={isFeatured}
        onChange={selected =>
          onChange({
            featured: selected ? true : false,
          })
        }
      />
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
