import { useEffect, useRef, useState } from "react";

import { PostVersion } from "@/lib/versioning";

import { parseDrafts } from "@/utils/utils";

import { useGetPost } from "./api.client";

export const usePostVersioning = (id?: number) => {
  const { data, refetch } = useGetPost({ id });
  const versionManager = useRef(new PostVersion(parseDrafts(data?.html_draft)));
  const [initialContent, setContent] = useState("");

  useEffect(() => {
    versionManager.current = new PostVersion(parseDrafts(data?.html_draft));
  }, [data?.html_draft]);

  useEffect(() => {
    onActivate(
      versionManager.current.getHistory()[
        versionManager.current.getHistory().length - 1
      ]?.timestamp
    );
  }, []);

  const onActivate = (timestamp: string) => {
    setContent(versionManager.current.retrieveBlogAtTimestamp(timestamp) ?? "");
  };
  return {
    onActivate,
    initialContent,
    versionManager: versionManager.current,
    refetch,
  };
};

export const useActivateEditorChangeAfterClick = () => {
  const ref = useRef(false);

  const activateChangeAction = () => {
    ref.current = true;
    document.removeEventListener("click", activateChangeAction);
  };

  useEffect(() => {
    document.addEventListener("click", activateChangeAction);
    return () => document.removeEventListener("click", activateChangeAction);
  }, []);

  return ref.current;
};
