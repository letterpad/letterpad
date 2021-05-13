import withAuthCheck from "../hoc/withAuth";
import {
  PostsDocument,
  PostsFilters,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "@/__generated__/queries/queries.graphql";
import { useRouter } from "next/router";
import { initializeApollo } from "@/graphql/apollo";
import { Button, Layout, PageHeader, Table } from "antd";

import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import { Author, Image, Setting } from "@/__generated__/type-defs.graphqls";
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Filters from "@/components/filters";

interface IProps {
  settings: Setting;
}

function Pages({ settings }: IProps) {
  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });
  const [filters, setFilters] = useState<PostsFilters>({});
  const [error, setError] = useState("");
  const router = useRouter();

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

  if (error) {
    return <ErrorMessage description={error} title="Error" />;
  }
  const source = postsNode.__typename === "PostsNode" ? postsNode.rows : [];
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Pages"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => router.push("/page/create")}
          >
            New Page
          </Button>,
        ]}
      ></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div className="site-layout-background" style={{ padding: 24 }}>
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
    </>
  );
}

const PagesWithAuth = withAuthCheck(Pages);
PagesWithAuth.layout = CustomLayout;
export default PagesWithAuth;

async function fetchPostsFromAPI(filters: PostsFilters) {
  const apolloClient = await initializeApollo();

  const post = await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      filters: {
        type: PostTypes.Page,
        ...filters,
      },
    },
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
  // {
  //   title: "Author",
  //   dataIndex: "author",
  //   key: "author",
  //   responsive: ["lg"] as Breakpoint[],
  //   render: (author: Author) => author.name,
  // },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Published",
    dataIndex: "publishedAt",
    key: "publishedAt",
  },
];
