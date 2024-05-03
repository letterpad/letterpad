import Link from "next/link";
import { FC } from "react";

import { Topic } from "./topic";

interface Props {
  topics: any[];
  limit?: number;
  selected?: string;
}
export const Topics: FC<Props> = ({ topics, limit, selected }) => {
  const items = limit ? topics?.splice(0, limit) : topics;

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {items.map((category) => (
          <Topic {...category} selected={selected} />
        ))}
      </ul>
      {limit && (
        <div className="py-6 px-2">
          <Link href="/topics" className="text-brand text-sm">
            Explore all topics
          </Link>
        </div>
      )}
    </>
  );
};
