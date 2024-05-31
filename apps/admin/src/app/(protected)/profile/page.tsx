"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "ui/dist/isomorphic.mjs";

import { Content } from "@/components/client-wrapper";

import { Feature } from "./_feature/feature";

function Profile() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <PageHeader className="site-page-header" title="Profile">
        <span className="help-text">
          Set up your profile. This will be used by themes to add author
          information for your blog posts.
        </span>
      </PageHeader>
      <Content>{mount && <Feature />}</Content>
    </>
  );
}

export default Profile;
