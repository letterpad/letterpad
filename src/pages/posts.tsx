import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import Link from "next/link";
import { initializeApollo } from "../graphql/apollo";
import { Button, Layout, PageHeader, Table } from "antd";

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
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
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

function Posts({ data, settings }: IProps) {
  const router = useRouter();
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

  return (
    <CustomLayout settings={settings}>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="Posts"
        // subTitle="This is a subtitle"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => router.push("/post/create")}
          >
            New Post
          </Button>,
        ]}
      ></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: "77vh" }}
        >
          <Table columns={columns} dataSource={postsNode?.rows} />
        </div>
      </Content>
    </CustomLayout>
  );
}

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);

  const post = await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      filters: {
        type: PostTypes.Post,
      },
    },
  });
  return {
    props: {
      data: post.data.posts,
    },
  };
}

export default withAuthCheck(Posts);
