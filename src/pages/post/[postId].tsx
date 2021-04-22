import { useSession } from "next-auth/client";
import {
  PostDocument,
  Post as PostType,
  PostQuery,
  PostQueryVariables,
} from "../../../__generated__/src/graphql/queries/queries.graphql";
import {
  UpdatePostDocument,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../../__generated__/src/graphql/queries/post.mutations.graphql";
import LetterpadEditor from "letterpad-editor";
import { initializeApollo } from "../../graphql/apollo";
import { Input, Layout, PageHeader, Tag, Tooltip } from "antd";
import { useRouter } from "next/router";
import Actions from "../../components/post-meta";
import { PostStatusOptions } from "../../../__generated__/src/graphql/type-defs.graphqls";
import { useState } from "react";
import { uploadFile } from "../../../shared/upload";
import { removeTypenames } from "../../../shared/removeTypenames";
import FileExplorer from "../../components/file-explorer";
import withAuthCheck from "../../hoc/withAuth";

const { Content, Footer } = Layout;

type ValueOf<T> = T[keyof T];
export enum MediaProvider {
  Unsplash = "unsplash",
  Letterpad = "letterpad",
}
function Post(pageProps) {
  let changeTimeout;
  const router = useRouter();
  const [session, loading] = useSession();
  const [post, setPost] = useState(pageProps.data.post);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [mediaProvider, setMediaProvider] = useState(MediaProvider.Unsplash);

  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>Access denied</div>;
  }

  const tagColor =
    post.status === PostStatusOptions.Published ? "green" : "orange";

  const uploadImage = async (files: File[]) => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    return uploadedFiles[0].src;
  };

  const setPostAttribute = async (
    key: keyof PostType,
    value: ValueOf<PostType>,
  ) => {
    setPost({ ...post, [key]: value });
    updatePostRequest(key, value, post.id, setPost);
  };

  const onMediaBrowse = () => {
    setMediaProvider(MediaProvider.Unsplash);
    setFileExplorerOpen(true);
  };

  const onFileExplorerClose = () => {
    setMediaProvider(MediaProvider.Letterpad);
    setFileExplorerOpen(false);
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
          <Input
            style={{ padding: 0, fontSize: 38 }}
            value={post.title}
            size="large"
            placeholder="Enter a title"
            bordered={false}
            onChange={e => {
              setPostAttribute("title", e.target.value);
            }}
          />
          <LetterpadEditor
            onImageBrowse={onMediaBrowse}
            uploadImage={(file: File) => uploadImage([file])}
            defaultValue={post.md_draft || post.md}
            tooltip={_Tooltip}
            onChange={change => {
              clearTimeout(changeTimeout);
              changeTimeout = setTimeout(() => {
                const { html, markdown } = change();
                if (markdown !== post.md) {
                  setPostAttribute("html", html);
                  setPostAttribute("md", markdown);
                }
              }, 2000);
            }}
            placeholder="Write a story.."
          />
          <FileExplorer
            multi={true}
            mediaProvider={mediaProvider}
            isVisible={fileExplorerOpen}
            handleCancel={onFileExplorerClose}
            switchProvider={mediaProvider => setMediaProvider(mediaProvider)}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default withAuthCheck(Post);

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);
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

const updatePostRequest = async (
  key: keyof PostType,
  value: ValueOf<PostType>,
  postId: number,
  onFail: (post: PostType) => void,
) => {
  const apolloClient = initializeApollo();
  const result = await apolloClient.mutate<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >({
    mutation: UpdatePostDocument,
    variables: {
      data: { ...removeTypenames({ [key]: value }), id: postId },
    },
  });

  if (result.errors?.length) {
    const postData = await apolloClient.query<PostQuery, PostQueryVariables>({
      query: PostDocument,
      variables: {
        filters: {
          id: postId,
        },
      },
    });
    onFail(postData.data.post);
  }
};

const _Tooltip: React.FC<any> = ({ children, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <span>{children}</span>
    </Tooltip>
  );
};
