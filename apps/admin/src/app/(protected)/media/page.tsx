import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Feature } from "./_feature/feature";

const Media = () => {
  return (
    <>
      <PageHeader className="site-page-header" title="Media">
        <span className="help-text">
          Here you will find the collection of images that you uploaded from
          your computer.
        </span>
      </PageHeader>
      <Content>
        <Feature />
      </Content>
    </>
  );
};

export default Media;
