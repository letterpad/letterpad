import React from "react";
import moment from "moment";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import { StyledItem } from "./ArticleList.css";
import { filterTaxonomies } from ".";
import config from "../../../config";

const RenderGrid: React.FC<any> = ({ data, setSelection }) => {
  return (
    <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
      {data.map(post => {
        const { categories } = filterTaxonomies(post.taxonomies);
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
              line2={moment(post.createdAt).format("MMM Do YYYY")}
              stickyText={categories}
            />
          </StyledItem>
        );
      })}
    </StyledGrid>
  );
};

export default RenderGrid;

function getCoverImage(cover_image) {
  return cover_image ? cover_image : "/admin/images/post.png";
}
