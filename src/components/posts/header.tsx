import { PageHeader } from "antd";
import { useRouter } from "next/router";
import { MouseEvent, ReactNode, useState } from "react";

import { Button } from "@/components_v2/button/button";
import { Modal } from "@/components_v2/modal";

import { PostTypes } from "@/__generated__/__types__";

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
            onClick={() => setShowModal(true)}
            ata-testid="createPostBtn"
          >
            New {type}
          </Button>,
        ]}
      >
        {children}
      </PageHeader>
      <Modal
        header="New Creative"
        show={showModal}
        toggle={setShowModal}
        footer={[
          <Button type="primary" key={1}>
            Create
          </Button>,
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card
            title={"Magazine Style"}
            description={"Grid layouts and image story composer"}
            onClick={() =>
              router.push(`/api/create?type=${type}&page_type=zigzag`)
            }
          />
          <Card
            title={"Rich Text Page"}
            description={"Create a page with rich text"}
            onClick={() =>
              router.push(`/api/create?type=${type}&page_type=default`)
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
    <a className="hover:text-inherit" onClick={handleClick}>
      <div className="card m-2 cursor-pointer border dark:border-gray-600 rounded-lg hover:shadow-xs dark:hover:border-gray-700">
        <div className="m-3">
          <h2 className="mb-2">{title}</h2>
          <p className="opacity-70">{description}</p>
        </div>
      </div>
    </a>
  );
};
