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
const { Content } = Layout;
import CustomLayout from "@/components/layouts/Layout";
import { useRouter } from "next/router";
import withAuthCheck from "../hoc/withAuth";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Head from "next/head";
import { postsStyles } from "@/components/posts.css";
import { postsColumns } from "@/components/posts";
import { fetchTags } from "./tags";

function Posts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PostsFilters>({});
  const [allTags, setAllTags] = useState<{ slug: string; name: string }[]>([]);
  const [postsNode, setPostsNode] = useState<PostsQuery["posts"]>({
    count: 0,
    rows: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts(filters);
    fetchTags().then(response => {
      if (!response.props.error) {
        const uniqueData = [
          ...response.props.data
            .reduce((map, obj) => map.set(obj.slug, obj), new Map())
            .values(),
        ];
        setAllTags(
          uniqueData.map(tag => ({
            slug: tag.slug,
            name: tag.name,
          })),
        );
      }
    });
  }, [JSON.stringify(filters)]);

  const fetchPosts = async (args = {}) => {
    const posts = await fetchPostsFromAPI(args);
    setLoading(false);
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
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <PageHeader
        className="site-page-header"
        title="Posts"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => router.push(`/api/create?type=${PostTypes.Post}`)}
          >
            New Post
          </Button>,
        ]}
      ></PageHeader>
      <Content>
        <div
          className="site-layout-background"
          style={{ padding: 16, minHeight: "77vh" }}
        >
          <Filters
            onStatusChange={status => setFilters({ ...filters, status })}
            onOrderChange={sortBy => setFilters({ ...filters, sortBy })}
            onTagChange={tagSlug => setFilters({ ...filters, tagSlug })}
            allTags={allTags}
          />
          <Table
            columns={postsColumns}
            dataSource={source}
            loading={loading}
            onRow={row => ({
              onClick: () => router.push("/post/" + row.id),
            })}
          />
        </div>
        <style jsx>{postsStyles}</style>
      </Content>
    </>
  );
}

const PostsWithAuth = withAuthCheck(Posts);
PostsWithAuth.layout = CustomLayout;
export default PostsWithAuth;

async function fetchPostsFromAPI(filters: PostsFilters) {
  const apolloClient = await initializeApollo();

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
