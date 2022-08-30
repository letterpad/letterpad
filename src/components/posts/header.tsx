import { PageHeader } from "antd";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { PostTypes } from "@/__generated__/__types__";

import { EnhancedButton } from "../buttons";

interface IProps {
  type: PostTypes;
  title: string;
  children: ReactNode;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  return (
    <PageHeader
      className="site-page-header"
      title={title}
      extra={[
        <EnhancedButton
          data-testid="createPostBtn"
          key="1"
          type="dark"
          onClick={() => router.push(`/api/create?type=${type}`)}
        >
          New {type}
        </EnhancedButton>,
      ]}
    >
      {children}
    </PageHeader>
  );
};
