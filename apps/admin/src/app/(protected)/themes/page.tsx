import { PageHeader } from "ui/dist/isomorphic.mjs";

import { Content } from "@/components/client-wrapper";

import { Feature } from "./_feature";

const Themes = () => {
  return (
    <>
      <PageHeader className="site-page-header" title="Themes">
        <span className="help-text">
          Select the theme you want to use for your site. Remember that few
          themes might not have all the features that are available.
        </span>
      </PageHeader>
      <Content>
        <div className="grid grid-flow-row-dense grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Feature />
        </div>
      </Content>
    </>
  );
};

export default Themes;
