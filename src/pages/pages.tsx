import withAuthCheck from "../hoc/withAuth";
import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import Link from "next/link";
import { initializeApollo } from "../graphql/apollo";
import { Layout, Table } from "antd";

import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import {
  Author,
  Image,
  Setting,
  Tags,
} from "../../__generated__/src/graphql/type-defs.graphqls";
const { Content } = Layout;
import CustomLayout from "../layouts/Layout";
import { PostsResponse } from "../graphql/type-defs.graphqls";
import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

const columns = [
  {
    title: "Image",
    dataIndex: "cover_image",
    key: "cover_image",
    responsive: ["md"] as Breakpoint[],
    render: (cover_image: Image) => <img src={cover_image.src} width={80} />,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (title: string, record) => (
      <Link href={"/post/" + record.id}>
        <a>{title}</a>
      </Link>
    ),
  },
  {
    title: "Description",
    dataIndex: "excerpt",
    key: "excerpt",
    responsive: ["md"] as Breakpoint[],
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    responsive: ["lg"] as Breakpoint[],
    render: (author: Author) => author.name,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    render: (tags: Tags[]) => tags.map(tag => tag.name).join(", "),
  },
  {
    title: "Published",
    dataIndex: "publishedAt",
    key: "publishedAt",
  },
];

interface IProps {
  data: PostsResponse;
  settings: Setting;
}

function Pages({ data, settings }: IProps) {
  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (data.__typename === "PostsNode") {
      const rows = data.rows.map(post => {
        return {
          ...post,
          key: post.id,
        };
      });
      setPostsNode({ ...data, rows });
    }

    if (data.__typename === "PostError") {
      setError(data.message);
    }
  }, []);

  if (error) return <ErrorMessage description={error} title="Error" />;

  // If session exists, display content
  return (
    <CustomLayout settings={settings}>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
        >
          <Table columns={columns} dataSource={postsNode?.rows} />
        </div>
      </Content>
    </CustomLayout>
  );
}

export default withAuthCheck(Pages);

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);

  const post = await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      filters: {
        type: PostTypes.Page,
      },
    },
  });
  return {
    props: {
      data: post.data,
    },
  };
}
