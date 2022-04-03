import { PostTypes } from "@/__generated__/__types__";
import { Button, PageHeader } from "antd";
import { useRouter } from "next/router";

interface IProps {
  type: PostTypes;
  title: string;
}

export const Header: React.FC<IProps> = ({ type, title, children }) => {
  const router = useRouter();
  return (
    <PageHeader
      className="site-page-header"
      title={title}
      extra={[
        <Button
          data-testid="createPostBtn"
          key="1"
          type="primary"
          onClick={() => router.push(`/api/create?type=${type}`)}
        >
          New {type}
        </Button>,
      ]}
    >
      {children}
    </PageHeader>
  );
};
