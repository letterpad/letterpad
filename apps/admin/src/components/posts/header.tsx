import { PageHeader } from "antd";
import { useRouter } from "next/router";
import { MouseEvent, ReactNode, useState } from "react";

import { Buttonv2 } from "@/components_v2/button";
import { Modal } from "@/components_v2/modal";

import { PostTypes } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

import { isCreativesActive } from "./switch";

interface IProps {
  type: PostTypes;
  title: string;
  children: ReactNode;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const onClick = (type, pageType: PageType) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "page",
      eventLabel: pageType,
    });
    router.push(`/api/create?type=${type}&page_type=${pageType}`);
  };

  const onNewClick = () => {
    isCreativesActive() ? setShowModal(true) : onClick(type, PageType.Default);
  };

  const buttonLabel = `New ${
    type === "page" ? (isCreativesActive() ? "Creative" : "Page") : "Post"
  }`;

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={title}
        extra={[
          <Buttonv2
            size="normal"
            key="1"
            data-testid="createPostBtn"
            onClick={() => onNewClick()}
          >
            {buttonLabel}
          </Buttonv2>,
        ]}
      >
        {children}
      </PageHeader>
      <Modal
        header="Select a Creative"
        show={showModal}
        toggle={setShowModal}
        footer={[]}
      >
        <div className="grid grid-cols-2">
          <Card
            title="Photo Story"
            description={
              "Grid of photos and text. Ideal for showcasing pictures."
            }
            onClick={() => onClick(type, PageType.StoryBuilder)}
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
          <h2 className="mb-2 text-lg">{title}</h2>
          <p className="opacity-70">{description}</p>
        </div>
      </div>
    </a>
  );
};
