import { Button, ButtonGroup } from "../../../components/button";

import PostActions from "../PostActions";
import { PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React from "react";
import StyledSwitch from "../../../components/switch";
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
      <StyledSwitch
        leftLabel={"Mark as Featured Post"}
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
  p {
    position: absolute;
    margin-top: -14px;
    font-size: 0.7rem;
    opacity: 0.5;
    font-style: italic;
  }
`;
