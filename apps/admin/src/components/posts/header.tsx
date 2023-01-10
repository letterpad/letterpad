import { useRouter } from "next/router";
import { MouseEvent, ReactNode, useState } from "react";

import { Buttonv2 } from "@/components_v2/button";
import { Modal } from "@/components_v2/modal";
import { PageHeader } from "@/components_v2/page-header";

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

  const onClick = (type, pageType: PageType) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: "New",
      eventLabel: `${type} - ${pageType}`,
    });
    router.push(`/api/create?type=${type}&page_type=${pageType}`);
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
        footer={[
          <Buttonv2
            variant="secondary"
            size="normal"
            key="1"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Buttonv2>,
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
