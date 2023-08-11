import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Button, Modal, PageHeader } from "ui";

import { PostTypes } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

interface IProps {
  type: PostTypes;
  title: string;
  children: ReactNode;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const onClick = async (type, pageType: PageType) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "New",
      eventLabel: `${type} - ${pageType}`,
    });
    const createdPost = await fetch(
      `/api/create?type=${type}&page_type=${pageType}`
    );
    const post = await createdPost.json();
    if (post?.id) {
      router.replace(`/${type}/${post.id}`);
    }
  };

  const onNewClick = () => {
    if (type === PostTypes.Post) {
      return onClick(type, PageType.Default);
    }
    setShowModal(true);
  };

  const buttonLabel = `New ${type === "page" ? "Creative" : "Post"}`;

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={title}
        extra={[
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
        ]}
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
