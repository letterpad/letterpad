import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPost } from "./api";

const usePost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<PostWithAuthorAndTagsFragment>();
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(parseInt(postId as string)).then((data) => {
      if (data.__typename === "Post") {
        setPost(data);
      }

      if (data.__typename === "PostError") {
        setError(data.message);
      }
    });
  }, []);

  return { post, setPost, error };
};

export default usePost;
