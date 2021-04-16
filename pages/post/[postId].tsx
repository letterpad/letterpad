import { useSession } from "next-auth/client";
import {
  PostDocument,
  PostQuery,
  PostQueryVariables,
} from "../../__generated__/lib/queries/queries.graphql";
import LetterpadEditor from "letterpad-editor";
import { initializeApollo } from "../../lib/apollo";
import { Layout, PageHeader, Tag } from "antd";
import { useRouter } from "next/router";
import PostTitle from "./PostTitle";
import Actions from "./actions";
import { PostStatusOptions } from "../../__generated__/lib/type-defs.graphqls";
import { useState } from "react";
import { uploadFile } from "../../shared/upload";
const { Content, Footer } = Layout;

export default function Page(pageProps) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [post, setPost] = useState(pageProps.data.post);

  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>Access denied</div>;
  }

  const tagColor =
    post.status === PostStatusOptions.Published ? "green" : "transparent";

  const uploadImage = async (files: FileList) => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    return uploadedFiles[0].src;
  };

  const setPostAttribute = (key, value) => {
    setPost({ ...post, [key]: value });
  };
  return (
    <Layout>
      <PageHeader
        className="site-page-header"
        title="&nbsp;"
        style={{ padding: 10 }}
        onBack={() => router.push("/posts")}
        extra={[<Actions post={post} setPostAttribute={setPostAttribute} />]}
        tags={<Tag color={tagColor}>{post.status}</Tag>}
      ></PageHeader>

      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ maxWidth: 760, minHeight: 360, margin: "auto" }}
        >
          <PostTitle
            text={post.title}
            placeholder="Enter a title"
            onChange={(value: string) => {
              // PostActions.setDraft({
              //   title: value,
              // });
            }}
          />

          <LetterpadEditor
            // onImageBrowse={this.onMediaBrowse}
            // getEditorInstance={this.onBeforeRender}
            //@ts-ignore
            uploadImage={(file: File) => uploadImage([file])}
            defaultValue={post.md_draft || post.md}
            // tooltip={Tooltip}
            onChange={() => {}}
            placeholder="Write a story.."
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const apolloClient = await initializeApollo({}, context);

  const post = await apolloClient.query<PostQuery, PostQueryVariables>({
    query: PostDocument,
    variables: {
      filters: {
        id: parseInt(context.query.postId),
      },
    },
  });
  return {
    props: {
      data: post.data,
    },
  };
}
