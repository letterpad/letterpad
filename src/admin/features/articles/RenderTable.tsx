import { Link } from "react-router-dom";
import { List } from "./ArticleList.css";
import React from "react";

const columns = [
  // { label: "Select", className: "selection-box" },
  { label: "Image", className: "cover-image" },
  { label: "Title", className: "title" },
  { label: "Published", className: "published" },
  { label: "Author", className: "author" },
  { label: "Status", className: "status" },
  { label: "Tags", className: "tags" },
];
const RenderTable = ({ data, setSelection, type }) => {
  return (
    <List>
      <header>
        {columns.map((item, i) => (
          <div key={i} className={item.className}>
            {item.label}
          </div>
        ))}
      </header>
      {data.map(post => {
        const authorName = post.author.name;
        return (
          <article key={post.slug}>
            {/* <StyledCheckbox>
              <input
                type="checkbox"
                id={"checkbox-" + post.id}
                onClick={() => setSelection(post.id)}
              />
              <label htmlFor={"checkbox-" + post.id} />
            </StyledCheckbox> */}
            <div className="cover-image">
              <div
                style={{
                  backgroundImage: `url('${post.cover_image.src}')`,
                  backgroundColor: "var(--bg-sections)",
                  border: "1px solid var(--color-border)",
                  backgroundSize: "cover",
                  width: "64px",
                  height: "64px",
                }}
              ></div>
            </div>

            <div className="title">
              <Link to={"/admin/posts/" + post.id}>
                <div className="title">{post.title}</div>

                <div className="small">
                  {post.excerpt.substring(0, 90) + "..."}
                </div>
              </Link>
            </div>
            <div className="small published">{smallDate(post.publishedAt)}</div>
            <div className="small author">{authorName}</div>
            <div className={"upper status"}>
              <div className={post.status}></div>
            </div>
            <div className="small tags">
              {type === "page" && "n/a"}
              {post.tags.map(item => item.name).join(", ")}
            </div>
          </article>
        );
      })}
    </List>
  );
};

export default RenderTable;

function smallDate(d) {
  let date = new Date(d);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
