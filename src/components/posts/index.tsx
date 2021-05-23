import { getImageAttrs } from "@/graphql/utils/imageAttributs";
import {
  Image,
  PostStatusOptions,
  Tags,
} from "@/__generated__/type-defs.graphqls";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";

export const columns = [
  {
    title: "Image",
    dataIndex: "cover_image",
    key: "cover_image",
    responsive: ["md"] as Breakpoint[],
    render: (cover_image: Image) => {
      if (!cover_image.src) return null;
      const imageAttrs = getImageAttrs(cover_image.src);
      return (
        <img
          {...imageAttrs}
          width={80}
          height={50}
          style={{ objectFit: "cover" }}
        />
      );
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "excerpt",
    key: "excerpt",
    responsive: ["md"] as Breakpoint[],
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: PostStatusOptions) => (
      <span className={`post-status post-status-${status}`} />
    ),
  },
  {
    title: "Published",
    dataIndex: "publishedAt",
    key: "publishedAt",
  },
];

export const postsColumns = [
  ...columns,
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    render: (tags: Tags[]) => tags.map(tag => tag.name).join(", "),
  },
];
