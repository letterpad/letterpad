import { PostTypes } from "letterpad-graphql";
import React from "react";

import { Header } from "@/app/(protected)/posts/_feature/header/header";

import { Feature } from "./_feature/feature";

async function Posts() {
  return (
    <>
      <Header type={PostTypes.Post} title="Posts">
        <span className="help-text">
          Write, edit, and publish posts for your site.
        </span>
      </Header>
      <Feature />
    </>
  );
}

export default Posts;
