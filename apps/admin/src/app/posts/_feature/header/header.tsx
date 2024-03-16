"use client";
import { PostStatusOptions, PostTypes } from "letterpad-graphql";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Button, Modal } from "ui";
import { PageHeader } from "ui/isomorphic";

import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";
import { isPost } from "@/utils/type-guards";

import { useCreatePost, useGetPosts } from "../api.client";
import { DEFAULT_FILTERS } from "../constants";
import { UpgradeLabel } from "../../../../components/upgrade-plan-banner";
import { useIsPaidMember } from "../../../../hooks/useIsPaidMember";
import { isMembershipFeatureActive } from "../../../../shared/utils";

interface IProps {
  type: PostTypes;
  title: string;
  children: ReactNode;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  const isPaidMemeber = useIsPaidMember();
  const isMember = isMembershipFeatureActive() || isPaidMemeber;
  const [showModal, setShowModal] = useState(false);
  const { createPost } = useCreatePost();
  const { refetch } = useGetPosts({ ...DEFAULT_FILTERS, type }, { skip: true });
  const onClick = async (type, pageType: PageType) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "New",
      eventLabel: `${type} - ${pageType}`,
    });
    const { data: post } = await createPost({
      type,
      page_type: pageType,
      status: PostStatusOptions.Draft,
    });
    refetch({ requestPolicy: "network-only" });
    if (isPost(post?.createPost)) {
      router.replace(`/${type}/${post?.createPost.id}`);
    }
  };

  const onNewClick = () => {
    if (type === PostTypes.Post) {
      return onClick(type, PageType.Default);
    }
    setShowModal(true);
  };

  const buttonLabel = `New ${type === "page" ? "Creative" : "Post"}`;
  const displayBtn =
    ((!isMembershipFeatureActive() || isPaidMemeber) && type === "page") ||
    type === "post";
  return (
    <>
      <PageHeader
        className="site-page-header"
        title={title}
        extra={
          displayBtn
            ? [
                <Button
                  size="normal"
                  key="1"
                  data-testid="createPostBtn"
                  onClick={() => onNewClick()}
                  className="flex items-center gap-1"
                >
                  <BiPlus size={16} />
                  {buttonLabel}
                </Button>,
              ]
            : [
                <Button
                  size="normal"
                  key="1"
                  className="flex items-center gap-1"
                  variant="secondary"
                >
                  <UpgradeLabel /> to publish creatives
                </Button>,
              ]
        }
      >
        {children}
      </PageHeader>
      <Modal
        header="Select a Creative"
        show={showModal}
        toggle={setShowModal}
        footer={[
          <Button
            variant="secondary"
            size="normal"
            key="1"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        <div className="grid grid-cols-2">
          <Card
            title="Photo Story"
            description={
              "Grid of photos and text. Ideal for showcasing pictures."
            }
            onClick={() => onClick(type, PageType["Story Builder"])}
          />
          <Card
            title={"Rich Text Page"}
            description={
              "Page with rich text. Ideal for long text content with some images."
            }
            onClick={() => onClick(type, PageType.Default)}
          />
        </div>
      </Modal>
    </>
  );
};

const Card = ({ title, description, onClick }) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick();
  };
  return (
    <a className="hover:text-inherit " onClick={handleClick}>
      <div className="card hover:shadow-xs m-2 cursor-pointer rounded-lg border hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-black/30">
        <div className="m-3">
          <h2 className="mb-2 text-md">{title}</h2>
          <p className="opacity-70">{description}</p>
        </div>
      </div>
    </a>
  );
};
