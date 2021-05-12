import {
  PostDocument,
  PostQuery,
  PostQueryVariables,
  InputUpdatePost,
} from "@/__generated__/queries/queries.graphql";
import {
  UpdatePostDocument,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import LetterpadEditor from "letterpad-editor";
import { initializeApollo } from "@/graphql/apollo";
import { Input, Layout, PageHeader, Tag, Tooltip } from "antd";
import { useRouter } from "next/router";
import Actions from "@/components/post-meta";
import {
  Image,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/type-defs.graphqls";
import { useEffect, useState } from "react";
import { uploadFile } from "../../../shared/upload";
import { removeTypenames } from "../../../shared/removeTypenames";
import FileExplorer from "@/components/file-explorer";
import withAuthCheck from "../../hoc/withAuth";
import ErrorMessage from "@/components/ErrorMessage";

const { Content } = Layout;

export enum MediaProvider {
  Unsplash = "unsplash",
  Letterpad = "letterpad",
}
let editor;
function Post() {
  let changeTimeout;
  const router = useRouter();

  const [post, setPost] = useState<PostQuery["post"]>();
  const [error, setError] = useState("");
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [mediaProvider, setMediaProvider] = useState(MediaProvider.Unsplash);

  useEffect(() => {
    const { postId } = router.query;
    if (!postId) return;
    getPost(parseInt(postId as string)).then(data => {
      if (data.__typename === "Post") {
        setPost(data);
      }

      if (data.__typename === "PostError") {
        setError(data.message);
      }
    });
  }, [router]);

  if (!post || post.__typename !== "Post") {
    return <ErrorMessage title="Error" description={error} />;
  }

  const uploadImage = async (files: File[]) => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    return uploadedFiles[0].src;
  };

  const setPostAttribute = async (attrs: Omit<InputUpdatePost, "id">) => {
    setPost({ ...post, ...attrs });
    const result = await updatePostRequest(attrs, post.id);
    if (result.data?.updatePost.__typename === "Post") {
      setPost(result.data.updatePost);
    }
  };

  const onMediaBrowse = () => {
    setMediaProvider(MediaProvider.Unsplash);
    setFileExplorerOpen(true);
  };

  const onFileExplorerClose = () => {
    setMediaProvider(MediaProvider.Letterpad);
    setFileExplorerOpen(false);
  };

  const insertImageUrlInEditor = async (images: { [url: string]: Image }) => {
    const urls = Object.keys(images);
    const insertPromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        try {
          editor.insertImageUrl(url);
          resolve(true);
        } catch (e) {
          reject();
          console.error(e);
        }
      });
    });
    return Promise.all(insertPromises);
  };

  const tagColor =
    post.status === PostStatusOptions.Published ? "green" : "orange";

  const isPost = post.type === PostTypes.Post;

  const setRef = _editor => {
    editor = _editor;
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PageHeader
        className="site-page-header"
        title="&nbsp;"
        style={{ padding: 10 }}
        onBack={() => router.push(isPost ? "/posts" : "/pages")}
        extra={[
          <Actions
            key="actions"
            post={post}
            setPostAttribute={setPostAttribute}
            deletePost={() => {
              setPostAttribute({ status: PostStatusOptions.Trashed });
              router.push(isPost ? "/posts" : "/pages");
            }}
          />,
        ]}
        tags={<Tag color={tagColor}>{post.status}</Tag>}
      ></PageHeader>

      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ maxWidth: 760, margin: "auto" }}
        >
          <Input
            style={{ padding: 0, fontSize: 38 }}
            value={post.title}
            size="large"
            placeholder="Enter a title"
            bordered={false}
            onChange={e => {
              setPostAttribute({ title: e.target.value });
            }}
          />
          <LetterpadEditor
            dark={localStorage.theme === "dark"}
            getEditorInstance={setRef}
            onImageBrowse={onMediaBrowse}
            uploadImage={(file: File) => uploadImage([file])}
            defaultValue={post.md_draft || post.md}
            tooltip={_Tooltip}
            onChange={change => {
              clearTimeout(changeTimeout);
              changeTimeout = setTimeout(() => {
                const { html, markdown } = change();
                if (markdown !== post.md) {
                  setPostAttribute({ html, md: markdown });
                }
              }, 2000);
            }}
            placeholder="Write a story.."
            // ref={setRef}
          />
          <FileExplorer
            multi={true}
            mediaProvider={mediaProvider}
            isVisible={fileExplorerOpen}
            handleCancel={onFileExplorerClose}
            onInsert={insertImageUrlInEditor}
            switchProvider={mediaProvider => setMediaProvider(mediaProvider)}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default withAuthCheck(Post);

async function getPost(postId: number) {
  const apolloClient = await initializeApollo();
  const post = await apolloClient.query<PostQuery, PostQueryVariables>({
    query: PostDocument,
    variables: {
      filters: {
        id: postId,
      },
    },
  });
  return post.data.post;
}

const updatePostRequest = async (
  attrs: Omit<InputUpdatePost, "id">,
  postId: number,
) => {
  const apolloClient = await initializeApollo();
  return await apolloClient.mutate<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >({
    mutation: UpdatePostDocument,
    variables: {
      data: { ...removeTypenames(attrs), id: postId },
    },
  });
};

const _Tooltip: React.FC<any> = ({ children, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <span>{children}</span>
    </Tooltip>
  );
};
