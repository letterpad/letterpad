"use client";

import TagsTable from "./components/tags-table";
import { TagsProvider } from "./context";

export const Feature = () => {
  return (
    <TagsProvider>
      <TagsTable />
    </TagsProvider>
  );
};
