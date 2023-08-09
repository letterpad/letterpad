import React from "react";

import { Settings } from "./settings";

const Page = () => {
  const cloudinaryEnabledByAdmin = !!(
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_SECRET
  );
  return <Settings cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin} />;
};

export default Page;
