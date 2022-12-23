import { basePath } from "@/constants";

export const getPostHash = (id: number) => {
  return fetch(basePath + "/api/getPostHash?id=" + id).then((res) =>
    res.text()
  );
};
