// import { getImageAttrs } from "@/graphql/utils/imageAttributs";
import { Image, PostStatusOptions, Tags } from "@/__generated__/__types__";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";

export const columns = [
  {
    title: "Image",
    dataIndex: "cover_image",
    key: "cover_image",
    responsive: ["md"] as Breakpoint[],
    width: "10%",
    render: (cover_image: Image) => {
      if (!cover_image.src) return null;
      const imageAttrs = { src: cover_image.src }; //getImageAttrs(cover_image.src);
      return (
        <img
          {...imageAttrs}
          width={60}
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
    width: "45%",
    render: (title: string) => <span>{title || "(Draft)"}</span>,
  },
  // {
  //   title: "Description",
  //   dataIndex: "excerpt",
  //   key: "excerpt",
  //   width: "45%",
  //   responsive: ["md"] as Breakpoint[],
  // },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: PostStatusOptions) => (
      <span className={`post-status post-status-${status}`} />
    ),
  },
  {
    title: "Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date: string) => {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat("en", { year: "2-digit" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

      return (
        <span>
          {da} {mo}, {ye}
        </span>
      );
    },
  },
];

export const postsColumns = [
  ...columns,
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    responsive: ["md"] as Breakpoint[],
    render: (tags: Tags[]) => tags.map((tag) => tag.name).join(", "),
  },
];
