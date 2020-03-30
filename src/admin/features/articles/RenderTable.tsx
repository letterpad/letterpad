import { List, Table } from "./ArticleList.css";

import { Link } from "react-router-dom";
import React from "react";

const columns = [
  { label: "Image", className: "cover-image" },
  { label: "Title", className: "title" },
  { label: "Published", className: "published" },
  { label: "Author", className: "author" },
  { label: "Status", className: "status" },
  { label: "Categories", className: "categories" },
  { label: "Select", className: "selection-box" },
];
const RenderTable = ({ data, setSelection }) => {
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
        const authorName = post.author.fname + " " + post.author.lname;
        return (
          <article key={post.slug}>
            <div className="cover-image">
              <div
                style={{
                  backgroundImage: `url('${post.cover_image.src}')`,
                  backgroundColor: "var(--bg-sections)",
                  border: "1px solid var(--color-border)",
                  backgroundPosition: "center",
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
            <div className="small categories">
              {post.categories.map(item => item.name).join(", ")}
            </div>
            <div className="selection-box">
              <input
                type="checkbox"
                id={"checkbox-" + post.id}
                onClick={() => setSelection(post.id)}
              />
              <label htmlFor={"checkbox-" + post.id} />
            </div>
          </article>
        );
      })}
    </List>
  );
  return (
    <Table className="table" columns={columns}>
      <thead>
        <tr>
          {columns.map((colName, i) => (
            <th key={i}>{colName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(post => {
          const authorName = post.author.fname + " " + post.author.lname;
          return (
            <tr key={post.slug}>
              <td>
                <div
                  style={{
                    background: `url('${post.cover_image.src}') var(--bg-base) center`,
                    width: "64px",
                    height: "64px",
                  }}
                ></div>
              </td>

              <td>
                <Link to={"/admin/posts/" + post.id}>
                  <div className="title">{post.title}</div>

                  <div className="small">{post.excerpt.slice(0, 60)}...</div>
                </Link>
              </td>
              <td className="small">{post.publishedAt}</td>
              <td className="small">{authorName}</td>
              <td className={"upper status " + post.status}>
                <span>{post.status}</span>
              </td>
              <td className="small">
                {post.categories.map(item => item.name).join(", ")}
              </td>
              <td className="selection-box">
                <input
                  type="checkbox"
                  id={"checkbox-" + post.id}
                  onClick={() => setSelection(post.id)}
                />
                <label htmlFor={"checkbox-" + post.id} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
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
