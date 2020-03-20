import React from "react";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import { StyledItem } from "./ArticleList.css";
import { getReadableDate } from "../../../shared/date";
const RenderGrid: React.FC<any> = ({ data, setSelection }) => {
  return (
    <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
      {data.map(post => {
        const authorName = post.author.fname + " " + post.author.lname;
        return (
          <StyledItem key={post.slug}>
            <div className="selection-box">
              <input
                type="checkbox"
                id={"checkbox-" + post.id}
                onClick={() => setSelection(post.id)}
              />
              <label htmlFor={"checkbox-" + post.id} />
            </div>
            <StyledGridItem
              image={getCoverImage(post.cover_image)}
              title={post.title}
              href={"/admin/posts/" + post.id}
              line1={authorName}
              line2={getReadableDate(post.createdAt)}
              stickyText={post.categories.map(item => item.name).join(", ")}
            />
          </StyledItem>
        );
      })}
    </StyledGrid>
  );
};

export default RenderGrid;

function getCoverImage(cover_image) {
  cover_image.src = cover_image.src
    ? cover_image.src
    : "/admin/images/post.png";
  return cover_image;
}
