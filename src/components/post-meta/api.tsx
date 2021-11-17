import nextConfig from "next.config";

export const getPostHash = (id: number) => {
  return fetch(nextConfig.basePath + "/api/getPostHash?id=" + id).then((res) =>
    res.text(),
  );
};
