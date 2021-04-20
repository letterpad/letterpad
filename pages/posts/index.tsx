import { useSession } from "next-auth/client";
import {
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  PostTypes,
} from "../../__generated__/lib/queries/queries.graphql";
import Link from "next/link";
import { initializeApollo } from "../../lib/apollo";
import { Layout, Table } from "antd";

import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import {
  Author,
  Image,
  Tags,
} from "../../__generated__/lib/type-defs.graphqls";
const { Header, Content, Footer } = Layout;
import CustomLayout from "../../layouts/Layout";
import { PostsNode } from "../../lib/type-defs.graphqls";

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

export default function Page({ data }: { data: PostsNode }) {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>Access denied</div>;
  }

  const posts = data.rows.map(post => {
    return {
      ...post,
      key: post.id,
    };
  });

  // If session exists, display content
  return (
    <CustomLayout>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: "77vh" }}
        >
          <Table columns={columns} dataSource={posts} />
        </div>
        <SortableComponent />
      </Content>
    </CustomLayout>
  );
}

export async function getServerSideProps(context) {
  const apolloClient = await initializeApollo({}, context);

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

import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { Component } from "react";

const SortableItem = SortableElement(({ value }) => <li>{value}</li>);

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  state = {
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: items,
    }));
  };
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}
