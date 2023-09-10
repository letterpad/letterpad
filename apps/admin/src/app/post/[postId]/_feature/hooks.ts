import { useEffect, useRef, useState } from "react";

import { useGetPost } from "./api.client";
import { PostVersion } from "../../../../lib/versioning";
import { parseDrafts } from "../../../../utils/utils";

export const useActivateUpdateAllowed = () => {
  const [allowChange, setAllowChange] = useState(false);

  const activateChangeAction = () => {
    setAllowChange(true);
  };

  useEffect(() => {
    document.addEventListener("click", activateChangeAction);
    return () => document.removeEventListener("click", activateChangeAction);
  }, []);

  return allowChange;
};

export const usePostVersioning = (id?: number) => {
  const { data } = useGetPost({ id });
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
  };
};
