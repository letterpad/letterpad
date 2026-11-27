import { ReactNode } from "react";

import { EditorialFrame } from "@/components/homepage/frame";

export default function TopicLayout({ children }: { children: ReactNode }) {
  return <EditorialFrame section="topic">{children}</EditorialFrame>;
}
