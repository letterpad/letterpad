import { PageHeader } from "antd";
import { useRouter } from "next/router";
import { MouseEvent, ReactNode, useState } from "react";

import { Button } from "@/components_v2/button/button";
import { Modal } from "@/components_v2/modal";

import { PostTypes } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";

import { isCreativesActive } from "./switch";

interface IProps {
  type: PostTypes;
  title: string;
  children: ReactNode;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <PageHeader
        className="site-page-header"
        title={title}
        extra={[
          <Button
            key="1"
            testid="createPostBtn"
            onClick={() =>
              isCreativesActive()
                ? setShowModal(true)
                : router.push(
                    `/api/create?type=${type}&page_type=${PageType.Default}`,
                  )
            }
          >
            New{" "}
            {type === "page"
              ? isCreativesActive()
                ? "Creative"
                : "Page"
              : "Post"}
          </Button>,
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
            onClick={() =>
              router.push(
                `/api/create?type=${type}&page_type=${PageType.StoryBuilder}`,
              )
            }
          />
          <Card
            title={"Rich Text Page"}
            description={
              "Page with rich text. Ideal for long text content with some images."
            }
            onClick={() =>
              router.push(
                `/api/create?type=${type}&page_type=${PageType.Default}`,
              )
            }
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
      <div className="card m-2 cursor-pointer border dark:border-gray-600 hover:bg-black/30 rounded-lg hover:shadow-xs dark:hover:border-gray-700">
        <div className="m-3">
          <h2 className="mb-2">{title}</h2>
          <p className="opacity-70">{description}</p>
        </div>
      </div>
    </a>
  );
};
