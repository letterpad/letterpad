import { Metadata } from "next";
import { ReactNode } from "react";

import { EditorialFrame } from "@/components/homepage/frame";

export const metadata: Metadata = {
  title: "Topics | Letterpad",
  description: "Browse stories by topic from independent writers on Letterpad.",
};

export default function TopicsLayout({ children }: { children: ReactNode }) {
  return <EditorialFrame section="topics">{children}</EditorialFrame>;
}
