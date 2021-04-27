import {
  PostsFilters,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "@/__generated__/queries/queries.graphql";
import { initializeApollo } from "@/graphql/apollo";
import { Button, Layout, PageHeader, Table } from "antd";
import Filters from "@/components/filters";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import {
  Author,
  Image,
  PostsResponse,
  Setting,
  Tags,
} from "@/__generated__/type-defs.graphqls";
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";

interface IProps {
  data: PostsResponse;
  settings: Setting;
}

function Posts({ settings }: IProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<PostsFilters>({});

  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts(filters);
  }, [JSON.stringify(filters)]);

  const fetchPosts = async (filters = {}) => {
    const posts = await fetchPostsFromAPI(filters);
    if (posts.__typename === "PostsNode") {
      const rows = posts.rows.map(post => {
        return {
          ...post,
          key: post.id,
        };
      });
      setPostsNode({ ...posts, rows });
    }

    if (posts.__typename === "PostError") {
      setError(posts.message);
    }
  };

  if (error) return <ErrorMessage description={error} title="Error" />;
  const source = postsNode.__typename === "PostsNode" ? postsNode.rows : [];

  return (
    <CustomLayout settings={settings}>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="Posts"
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
          <Filters
            onStatusChange={status => setFilters({ ...filters, status })}
            onOrderChange={sortBy => setFilters({ ...filters, sortBy })}
          />
          <Table
            columns={columns}
            dataSource={source}
            onRow={row => ({
              onClick: () => router.push("/post/" + row.id),
            })}
          />
        </div>
      </Content>
    </CustomLayout>
  );
}
export default withAuthCheck(Posts);

async function fetchPostsFromAPI(filters: PostsFilters) {
  const apolloClient = initializeApollo();

  const post = await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      filters: {
        type: PostTypes.Post,
        ...filters,
      },
    },
    fetchPolicy: "network-only",
  });
  return post.data.posts;
}

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
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
];
