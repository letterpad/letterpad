import React from "react";
import { PageHeader } from "ui/dist/isomorphic.mjs";

import { Settings } from "./_feature/feature";

const Page = async () => {
  const cloudinaryEnabledByAdmin = !!(
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_SECRET
  );

  return (
    <>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">Manage your website and account.</span>
      </PageHeader>
      <Settings
        cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
        mcpEnabled={process.env.LETTERPAD_MCP_ENABLED === "true"}
      />
    </>
  );
};

export default Page;
