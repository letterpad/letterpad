import { Link } from "react-router-dom";
import React from "react";
import { Table } from "./ArticleList.css";

const columns = [
  "Image",
  "Title",
  "Published At",
  "Author",
  "Status",
  "Category",
  "",
];
const RenderTable = ({ data, setSelection }) => {
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
