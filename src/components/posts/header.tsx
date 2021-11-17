import { PostTypes } from "@/__generated__/__types__";
import { Button, PageHeader } from "antd";
import { useRouter } from "next/router";

interface IProps {
  type: PostTypes;
  title: string;
}

export const Header = ({ type, title }: IProps) => {
  const router = useRouter();
  return (
    <PageHeader
      className="site-page-header"
      title={title}
      extra={[
        <Button
          key="1"
          type="primary"
          onClick={() => router.push(`/api/create?type=${type}`)}
        >
          New
        </Button>,
      ]}
    ></PageHeader>
  );
};
