import "react-datepicker/dist/react-datepicker.css";

import { Button, ButtonGroup } from "../../../components/button";
import {
  Post,
  PostStatusOptions,
  PostTypes,
  TaxonomyType,
} from "../../../../__generated__/gqlTypes";
import React, { useEffect, useState } from "react";

import CloseIcon from "../../../public/images/Close";
import DatePicker from "react-datepicker";
import Excerpt from "./Excerpt";
import FeaturedImage from "./FeaturedImage";
import FeaturedPost from "./FeaturedPost";
import { Container as LabelBox } from "../../../components/input/Input.css";
import { Link } from "react-router-dom";
import { MediaProvider } from "../Edit";
import Portal from "../../portal";
import PostActions from "../PostActions";
import Taxonomies from "./Taxonomies";
import Unpublish from "./Unpublish";
import UpdateSlug from "./UpdateSlug";
import config from "../../../../config";
import styled from "styled-components";

interface IProps {
  onDelete: (e: React.SyntheticEvent) => void;
  isOpen: boolean;
  toggleDisplay: (flag: boolean) => void;
  isPublished: boolean;
  canRepublish: boolean;
  isScheduled: boolean;
  post: Post;
}

const PostSettings: React.FC<IProps> = ({
  onDelete,
  isOpen,
  toggleDisplay,
  isPublished,
  post,
  isScheduled,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [previewUrl, setPreview] = useState("");

  useEffect(() => {
    if (post.scheduledAt) {
      setStartDate(new Date(post.scheduledAt));
    } else {
      setStartDate(new Date());
    }
  }, [post.scheduledAt]);

  useEffect(() => {
    document.addEventListener("click", detectClick);
    return () => {
      return document.removeEventListener("click", detectClick);
    };
  }, []);

  useEffect(() => {
    fetch(config.HASH_URL + "?id=" + post.id, {
      headers: {
        authorization: localStorage.token,
      },
    })
      .then(res => res.text())
      .then(hash => {
        setPreview(config.BASE_NAME + "/preview/post/" + hash);
      });
  }, []);

  const detectClick = e => {
    let targetElement = e.target;
    if (!targetElement) return;

    do {
      if (
        targetElement &&
        targetElement.classList &&
        targetElement.classList.contains("react-datepicker")
      ) {
        // This is a click inside. Do nothing, just return.
        console.log("inside");
        return;
      }
      // Go up the DOM
      targetElement = targetElement.parentNode;
    } while (targetElement);

    // This is a click outside.
    if (showCalendar) {
      setShowCalendar(false);
    }
  };

  let currentHour = new Date().getHours();
  const selectedDateIsToday = new Date().getDate() === startDate.getDate();
  if (!selectedDateIsToday) currentHour = 0;

  const doPublish = async () => {
    PostActions.setDraft({ status: PostStatusOptions.Publish });
    await PostActions.updatePost();

    setShowCalendar(false);
  };

  if (!post) return null;

  const updatePost = async () => {
    await PostActions.updatePost();
  };

  const closeDrawer = (e: React.SyntheticEvent) => {
    e.preventDefault();
    toggleDisplay(false);
  };

  const showPublishOptions = () => {
    setShowCalendar(true);
  };

  return (
    <div>
      <Container isOpen={isOpen}>
        <header>
          <Link to="#" onClick={closeDrawer} data-testid="close-settings">
            <CloseIcon />
          </Link>

          <ButtonGroup>
            <Button
              btnSize="sm"
              btnStyle="success"
              onClick={doPublish}
              disabled={isPublished}
            >
              Publish Now
            </Button>
            <Button
              compact
              btnStyle="primary"
              btnSize="sm"
              onClick={showPublishOptions}
              disabled={isPublished}
            >
              <i className="fa fa-calendar" />
            </Button>
          </ButtonGroup>
        </header>
        <ButtonGroup>
          {!isPublished && (
            <div>
              {showCalendar && (
                <Portal>
                  <div className="lp-datepicker">
                    <DatePicker
                      selected={startDate}
                      onChange={newDate => {
                        setStartDate(newDate);
                        PostActions.setDraft({ scheduledAt: newDate });
                      }}
                      minDate={new Date()}
                      showTimeSelect
                      minTime={
                        new Date(new Date().setHours(currentHour, 0, 0, 0))
                      }
                      maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
                      placeholderText="Select a date"
                      dateFormat="MMMM d, yyyy - h:mm aa"
                      inline
                    />
                    <footer>
                      <Button
                        btnSize="sm"
                        onClick={() => {
                          setShowCalendar(false);
                          PostActions.setDraft({ scheduledAt: null });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        btnSize="sm"
                        onClick={() => {
                          setShowCalendar(false);
                          PostActions.updatePost();
                        }}
                      >
                        Publish Later
                      </Button>
                    </footer>
                  </div>
                </Portal>
              )}
            </div>
          )}
        </ButtonGroup>
        <br />
        <a href={previewUrl} className="preview-link" target="_blank">
          Preview this {post.type}
        </a>
        <br />
        <br />
        {isScheduled && (
          <LabelBox>
            <label>Posting on:</label>
            {new Date(startDate).toLocaleString()}{" "}
            <Button
              btnStyle="link"
              btnSize="xs"
              onClick={() => {
                PostActions.setDraft({ scheduledAt: null });
                PostActions.updatePost();
              }}
              style={{ color: "#f1410b" }}
            >
              delete
            </Button>
          </LabelBox>
        )}
        <Unpublish status={post.status} updatePost={updatePost} />
        {post.type === PostTypes.Post && (
          <FeaturedPost isFeatured={post.featured} updatePost={updatePost} />
        )}
        <Excerpt
          md={post.md}
          excerpt={post.excerpt}
          updatePost={updatePost}
          isSettingsOpen={isOpen}
        />
        <UpdateSlug slug={post.slug} updatePost={updatePost} />
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={() => null}
            post={post}
            for={TaxonomyType.PostTag}
            suggestions={[]}
          />
        )}
        <FeaturedImage post={post} mediaProvider={MediaProvider.Unsplash} />
        <br />
        <Button btnSize="md" onClick={onDelete} btnStyle="danger">
          Delete Post
        </Button>
        <br />
        <br />
      </Container>

      {isOpen && <BackFade onClick={closeDrawer} />}
    </div>
  );
};

export default React.memo(PostSettings);

interface IContainerProps {
  isOpen: boolean;
}
const Container = styled.div<IContainerProps>`
  position: fixed;
  left: 100%;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(-290px)" : "translateX(0px)"};
  transition: 0.4s cubic-bezier(0.075, 0.82, 0.165, 1) all;
  top: 0px;
  width: 290px;
  height: 100vh;
  overflow-y: auto;
  background: var(--bg-base);
  z-index: 9;
  padding: 24px;
  > div {
    label {
      font-size: 0.8rem;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
      margin-top: 28px;
    }
    &:first-child label {
      margin-top: 0px;
    }
  }
  button {
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .preview-link {
    text-transform: uppercase;
    font-size: 0.8rem;
    text-decoration: underline;
    margin-top: 24px;
  }
`;

const BackFade = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: #333;
  opacity: 0.8;
`;
